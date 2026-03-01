"""
Artwork generation client for emotional artwork.
Moved from services/analysis.py - preserving original logic.
"""
from typing import Optional
import logging
import base64
import random
from openai import AsyncOpenAI
from uuid import UUID

from config import get_settings
from utils.prompts import load_prompt
from utils.image_storage import save_emotion_artwork

settings = get_settings()
logger = logging.getLogger(__name__)

# Style pools for pre-selection — forces genuine variety every run
_PICK_A_MEDIUM = [
    "oil impasto", "watercolor wash", "gouache matte", "acrylic pour",
    "ink wash sumi-e", "risograph print", "screenprint", "linocut / woodcut",
    "etching / aquatint", "lithograph", "charcoal + smudge", "pastel dust",
    "colored pencil grain", "graphite photoreal", "cyanotype", "stained glass",
    "enamel on metal", "ceramic glaze", "claymation still", "paper collage",
    "torn-poster décollage", "thread embroidery", "felt applique", "tapestry weave",
    "ink-in-water macro", "generative vector", "minimalist 3D render",
    "voxel diorama", "stop-motion set photo", "analog film double exposure",
    "pinhole camera look", "photogram", "bas-relief sculpture render",
    "sand art", "fresco / mural texture", "mosaic tile",
]

_PICK_B_MOVEMENT = [
    "surrealism", "expressionism", "symbolism", "abstract expressionism",
    "cubism", "futurism", "bauhaus minimalism", "art deco", "baroque drama",
    "romantic sublime", "japanese ukiyo-e", "art nouveau", "brutalism",
    "solarpunk", "cyberpunk (non-branded)", "biopunk", "retrofuturism",
    "vaporwave (no text)", "constructivism", "suprematism", "de stijl",
    "naive folk-art", "magical realism", "gothic (atmospheric)", "wabi-sabi",
    "zen minimal", "post-impressionism", "chiaroscuro realism",
    "sci-fi concept art", "speculative naturalism",
    "dreamlike children's-book (no text)", "architectural visualization",
    "Renaissance realism", "Rococo", "Neoclassicism",
    "Impressionism / plein-air", "Fauvism", "Color Field painting",
    "Pop Art", "Hard-edge minimalism", "Mid-century modern illustration",
    "Graphic novel / comic ink art",
]

_PICK_C_PALETTE = [
    "near-monochrome graphite", "warm-dominant ember + soot",
    "cool-dominant ice + ink", "split-complementary tension",
    "muted earths + oxidized accents", "neon accents on neutral field",
    "high-key pastel haze", "deep low-saturation nocturne",
    "metallics (gold/copper) + matte blacks", "bleached sun-faded tones",
    "infrared-like false color", "limited 2–3 pigment palette",
]

_PICK_D_LIGHTING = [
    "candlelit chiaroscuro", "fog-diffused dawn", "harsh noon with hard shadows",
    "bioluminescent internal glow", "rim-lit silhouettes", "storm-flash strobe",
    "soft studio bounce", "eclipse light / penumbra",
    "underwater caustics", "sodium-vapor streetlight vibe",
]

_PICK_E_ARTIST = [
    "Vincent van Gogh (swirling impasto, emotional brushwork, vibrant isolated fields)",
    "Leonardo da Vinci (sfumato gradients, technical precision, Renaissance depth)",
    "Rembrandt van Rijn (dramatic chiaroscuro, warm amber shadows, intimate realism)",
    "Claude Monet (soft broken color, atmospheric haze, impressionist light dissolution)",
    "Salvador Dalí (hyper-rendered surreal dream logic, melting precision)",
    "Frida Kahlo (symbolic still objects, flat folkloric patterning, vivid local color)",
    "Wassily Kandinsky (pure geometric abstraction, musical rhythm, color-field tension)",
    "Gustav Klimt (gold-leaf ornamentation, decorative flatness, art nouveau organic line)",
    "Edward Hopper (stark architectural loneliness, theatrical light shafts, quiet tension)",
    "Georgia O'Keeffe (extreme close-up organic forms, desert color, magnified simplicity)",
    "Jean-Michel Basquiat (raw graffiti energy, fragmented marks, neo-expressionist chaos)",
    "Hieronymus Bosch (densely populated fantastical scenes, medieval horror-wonder)",
    "M.C. Escher (impossible geometry, paradoxical perspective, interlocking forms)",
    "Hokusai (flat perspective, bold outline, graphic natural force, woodblock grain)",
    "Mark Rothko (luminous color-field rectangles, meditative depth, soft edge blur)",
    "Yayoi Kusama (infinite dot / net patterns, psychedelic repetition, obsessive surface)",
    "Francis Bacon (distorted figuration, raw meat tones, existential smear)",
    "Andrew Wyeth (muted tempera realism, lonesome rural melancholy, hidden narrative)",
    "René Magritte (pristine realist surface concealing impossible logic, deadpan strangeness)",
    "Caravaggio (extreme tenebrism, hyper-real texture, theatrical spotlight)",
    "Paul Gauguin (tropical flat color, bold outlines, Tahitian symbolic primitivism)",
    "Egon Schiele (raw angular line, exposed vulnerability, contour over color)",
    "Turner (romantic storm, luminous atmosphere, formless sublime dissolution)",
]

_SUBJECTS = [
    "artifact", "landscape", "architecture", "organism", "machine",
    "weather-system", "impossible object", "pure abstraction",
    "microscopic world", "celestial body",
]

_SETTINGS = [
    "subterranean", "aerial", "underwater", "desert", "arctic",
    "megacity", "pastoral", "liminal interior", "cosmic", "laboratory",
    "abandoned theatre", "flooded library", "salt flat",
]

_COMPOSITIONS = [
    "symmetrical altar-like", "sweeping diagonal", "tight macro",
    "expansive negative space", "spiral flow", "fractured planes",
    "central void", "off-center focal mass",
]

_TEXTURES = [
    "brittle", "viscous", "granular", "fibrous", "crystalline",
    "smoky", "velvety", "corroded", "wet-gloss", "chalky", "glassy",
]


def _pick_style() -> dict:
    """Randomly pre-select one option from each mandatory style dimension."""
    return {
        "medium": random.choice(_PICK_A_MEDIUM),
        "movement": random.choice(_PICK_B_MOVEMENT),
        "palette": random.choice(_PICK_C_PALETTE),
        "lighting": random.choice(_PICK_D_LIGHTING),
        "artist": random.choice(_PICK_E_ARTIST),
        "subject": random.choice(_SUBJECTS),
        "setting": random.choice(_SETTINGS),
        "composition": random.choice(_COMPOSITIONS),
        "texture": random.choice(_TEXTURES),
    }


async def generate_emotion_artwork(
    entry_id: UUID,
    s3_folder_id: UUID,
    formatted_conversation: str,
    framework: str = "mental_wellness"
) -> Optional[str]:
    """
    Generate abstract artwork directly from formatted conversation with [HUMAN]/[AI] markers.
    Sends conversation with instructions directly to image model.
    Uses universal artwork prompt (same for all frameworks).

    Args:
        entry_id: ID of the journal entry
        s3_folder_id: UUID for S3 folder isolation (typically user_id)
        formatted_conversation: Conversation text with [HUMAN] and [AI] markers
        framework: The framework to use for artwork generation (kept for compatibility)

    Returns:
        S3 object key (e.g., "Artworks/s3-folder-id/entry-id.webp") or None
    """
    try:
        logger.info(f"Generating emotion artwork for entry {entry_id}")

        # Pre-select style dimensions in Python so the model cannot default to its favorite
        style = _pick_style()
        logger.info(
            f"Pre-selected style — medium: {style['medium']!r}, "
            f"movement: {style['movement']!r}, palette: {style['palette']!r}, "
            f"lighting: {style['lighting']!r}, artist: {style['artist']!r}"
        )

        # Load universal artwork prompt and inject pre-selected style
        artwork_prompt = load_prompt("artwork.md")
        artwork_prompt = artwork_prompt.replace("{{MEDIUM}}", style["medium"])
        artwork_prompt = artwork_prompt.replace("{{MOVEMENT}}", style["movement"])
        artwork_prompt = artwork_prompt.replace("{{PALETTE}}", style["palette"])
        artwork_prompt = artwork_prompt.replace("{{LIGHTING}}", style["lighting"])
        artwork_prompt = artwork_prompt.replace("{{ARTIST}}", style["artist"])
        artwork_prompt = artwork_prompt.replace("{{SUBJECT}}", style["subject"])
        artwork_prompt = artwork_prompt.replace("{{SETTING}}", style["setting"])
        artwork_prompt = artwork_prompt.replace("{{COMPOSITION}}", style["composition"])
        artwork_prompt = artwork_prompt.replace("{{TEXTURE}}", style["texture"])
        logger.info("Loaded and styled universal artwork prompt")

        # Combine instructions with formatted conversation for image model
        full_prompt = f"{artwork_prompt}\n\nConversation:\n{formatted_conversation}"

        # Initialize OpenAI client
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        # Generate the image directly
        params = {
            "model": settings.OPENAI_IMAGE_MODEL,
            "prompt": full_prompt,
            "n": 1,
            "size": settings.OPENAI_IMAGE_SIZE,
        }

        image_response = await client.images.generate(**params)

        if not image_response.data or len(image_response.data) == 0:
            logger.error("No image data in OpenAI response")
            return None

        b64_json = image_response.data[0].b64_json

        if not b64_json:
            logger.error("No base64 data in OpenAI response")
            return None

        image_bytes = base64.b64decode(b64_json)

        # Save to S3 with s3_folder_id for folder isolation
        s3_key = save_emotion_artwork(entry_id, s3_folder_id, image_bytes)

        if s3_key:
            logger.info(f"Successfully saved artwork to S3: {s3_key}")

        return s3_key

    except Exception as e:
        logger.error(f"Failed to generate emotion artwork: {e}", exc_info=True)
        return None
