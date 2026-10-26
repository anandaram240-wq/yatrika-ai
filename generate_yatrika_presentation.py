import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_yatrika_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette (Karnataka Colors & Contemporary Aesthetics)
    DARK_RED = RGBColor(185, 28, 28)     # #b91c1c (Karnataka Crimson)
    GOLD_AMBER = RGBColor(217, 119, 6)   # #d97706 (Haldi Gold)
    DARK_STONE = RGBColor(24, 24, 27)    # #18181b (Charcoal)
    SLATE_GRAY = RGBColor(71, 85, 105)   # #475569
    CARD_BG = RGBColor(254, 252, 232)    # Warm cream / amber-50
    CARD_BORDER = RGBColor(253, 230, 138)# amber-200
    WHITE = RGBColor(255, 255, 255)
    TEAL = RGBColor(13, 148, 136)        # #0d9488 (Coastal)
    EMERALD = RGBColor(16, 185, 129)

    blank_layout = prs.slide_layouts[6]

    def add_slide_header(slide, title_text, section_tag):
        # Top Red/Gold Ribbon
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
        shape.fill.solid()
        shape.fill.fore_color.rgb = DARK_RED
        shape.line.fill.background()

        # Section Tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.35))
        tf = tag_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = section_tag.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = GOLD_AMBER

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = DARK_STONE

    # ==============================================================
    # SLIDE 1: Title Slide
    # ==============================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = DARK_STONE
    bg1.line.fill.background()

    # Red/Gold top bars
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.18))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = DARK_RED
    top_bar.line.fill.background()

    gold_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(0.18), Inches(13.333), Inches(0.08))
    gold_bar.fill.solid()
    gold_bar.fill.fore_color.rgb = GOLD_AMBER
    gold_bar.line.fill.background()

    # Event Subtitle
    ev_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(0.5))
    p = ev_box.text_frame.paragraphs[0]
    p.text = "KANNADA DIGITAL INNOVATION HACKATHON 2026 • NIE MYSURU"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GOLD_AMBER

    # Title
    t_box = s1.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.3), Inches(1.8))
    tf = t_box.text_frame
    p = tf.paragraphs[0]
    p.text = "YatriKa AI (ಯಾತ್ರಿಕ)"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2 = tf.add_paragraph()
    p2.text = "Intelligent Cultural & Linguistic Travel Planner for Karnataka"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(252, 211, 77)

    # Problem Statement Badge
    ps_box = s1.shapes.add_textbox(Inches(1.0), Inches(4.0), Inches(11.3), Inches(0.6))
    p = ps_box.text_frame.paragraphs[0]
    p.text = "Problem Statement 06: Travel & Tourism • AI Travel Planner for Karnataka"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(248, 113, 113)

    # 4 Quick Highlights
    h_box = s1.shapes.add_textbox(Inches(1.0), Inches(5.0), Inches(11.3), Inches(1.2))
    tf = h_box.text_frame
    p = tf.paragraphs[0]
    p.text = "• Deterministic Highway & Ghat Routing Engine  •  Verified ASI & KSTDC Database (20+ Sites)\n•  In-Context Kannada Audio Phrases at Every Stop  •  Sub-50ms Offline Generation (0 API Latency)"
    p.font.size = Pt(14)
    p.font.color.rgb = RGBColor(228, 228, 231)

    # ==============================================================
    # SLIDE 2: Section 1 — Problem Statement & Who Is Affected
    # ==============================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_header(s2, "Problem Statement: The Karnataka Travel & Culture Gap", "Section 1 • Problem Context")

    # 3 Cards
    cards_data_s2 = [
        ("The Challenge", "Karnataka welcomes over 20 million tourists annually across 6 distinct cultural and ecological zones. However, visitors struggle with fragmented travel data, unrealistic driving estimations, and total linguistic disorientation once leaving metropolitan areas."),
        ("Who Is Affected", "1. Domestic & International Tourists facing language barriers with auto drivers, hotels, and temple counters.\n2. Weekend Explorers from Bengaluru needing realistic, feasible circuits without ghat-road hazards.\n3. Local Artisans & Khanavalis often bypassed by generic tourism portals."),
        ("Why It Matters", "Karnataka's heritage is deeply tied to spoken Kannada and regional culture. Monolithic travel guides treat the state as an English tourist brochure, ignoring local dialects, regional food traditions, and authentic cultural etiquette.")
    ]

    for i, (title, content) in enumerate(cards_data_s2):
        left = Inches(0.8 + i * 3.9)
        top = Inches(1.7)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER

        tb = s2.shapes.add_textbox(left + Inches(0.25), top + Inches(0.25), Inches(3.2), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = DARK_RED

        p2 = tf.add_paragraph()
        p2.text = content
        p2.font.size = Pt(12)
        p2.font.color.rgb = DARK_STONE

    # ==============================================================
    # SLIDE 3: Section 2 — Existing Systems & Their Fatal Gaps
    # ==============================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_header(s3, "Existing Systems vs Real Traveler Pain Points", "Section 2 • Gap Analysis")

    existing_gaps = [
        ("Commercial Portals\n(MakeMyTrip / Yatra)", "• Cookie-cutter 4-day hotel packages\n• Zero KSRTC bus or local transit options\n• No regional Kannada language assistance\n• Pushes commercial hotels over real homestays"),
        ("Generic LLM Prompts\n(ChatGPT / Gemini)", "• Hallucinates non-existent places & wrong fees\n• Ignores ghat road closures & speed limits\n• Requires live Wi-Fi (crashes in remote areas)\n• No spatial feasibility or budget itemization"),
        ("Official Portals\n(Karnataka Tourism)", "• Static PDF brochures without personalization\n• Disconnected booking portals (KSTDC / JLR)\n• Zero mobile-friendly dynamic routing\n• No real-time crowd or weather advisories"),
    ]

    for i, (title, content) in enumerate(existing_gaps):
        left = Inches(0.8 + i * 3.9)
        top = Inches(1.7)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(226, 232, 240)

        tb = s3.shapes.add_textbox(left + Inches(0.25), top + Inches(0.25), Inches(3.2), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = DARK_RED

        p2 = tf.add_paragraph()
        p2.text = content
        p2.font.size = Pt(12)
        p2.font.color.rgb = SLATE_GRAY

    # ==============================================================
    # SLIDE 4: Section 3 — How YatriKa AI Is Radically Different
    # ==============================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_header(s4, "How YatriKa AI Is Radically Different", "Section 3 • Innovation & Differentiation")

    diff_data = [
        ("1. In-Context Kannada Voice", "Directly fulfills the hackathon theme: Every destination stop features situational Kannada audio phrases (auto bargaining, temple entry, food ordering) with instant Web Speech pronunciation."),
        ("2. Deterministic Feasibility", "Zero hallucinated routes. Pacing calculations distinguish between 75 km/h expressways and 20 km/h Western Ghats hairpins, actively warning against night driving."),
        ("3. Verified ASI & KSTDC Data", "20+ curated heritage and nature sites with accurate fees (₹120 Mysore Palace, ₹40 Hampi, ₹20 Nandi Hills), real operating hours, and best seasons."),
        ("4. Zero-API Latency Moat", "Runs 100% in-browser. Zero external API calls means sub-50ms instant generation, zero Wi-Fi dropouts during demos, and zero server hosting expenses.")
    ]

    for i, (title, content) in enumerate(diff_data):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 5.9)
        top = Inches(1.7 + row * 2.6)

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.6), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER

        tb = s4.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), Inches(5.1), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = DARK_RED

        p2 = tf.add_paragraph()
        p2.text = content
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = DARK_STONE

    # ==============================================================
    # SLIDE 5: Section 4 — Technical Approach & Methodology
    # ==============================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_header(s5, "Methodology: 5-Stage Smart Generation Pipeline", "Section 4 • Technical Approach")

    pipeline_steps = [
        ("Step 1: Input Matrix", "Captures Starting Hub (Bengaluru/Mysuru/Mangaluru/Hubli), Vibe (Heritage/Coast/Hills), Duration (1-7D), Budget (3 tiers), and Party Style."),
        ("Step 2: Circuit Clustering", "Filters candidate destinations by geographic proximity to prevent backtracking. Enforces realistic drive-time envelopes."),
        ("Step 3: Temporal Slotting", "Distributes activities into Morning, Afternoon, and Evening slots factoring in temple closures (1-3 PM) and sunset vistas."),
        ("Step 4: Cultural Enrichment", "Maps regional food specialties (Guru Sweet Mart, Machali) and binds situational Kannada phrases to each specific stop."),
        ("Step 5: Budget Itemization", "Calculates Stay + Meals + Transit + Verified Ticket Fees into a transparent itemized per-person financial plan.")
    ]

    for i, (title, desc) in enumerate(pipeline_steps):
        left = Inches(0.8 + i * 2.35)
        top = Inches(1.7)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(2.2), Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = GOLD_AMBER

        tb = s5.shapes.add_textbox(left + Inches(0.15), top + Inches(0.2), Inches(1.9), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = DARK_RED

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = SLATE_GRAY

    # ==============================================================
    # SLIDE 6: Section 5 — Tech Stack & Architecture Diagram
    # ==============================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_slide_header(s6, "Software Architecture & Technology Stack", "Section 5 • Architecture")

    # Left: Stack Box
    stack_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.7), Inches(4.5), Inches(5.0))
    stack_card.fill.solid()
    stack_card.fill.fore_color.rgb = CARD_BG
    stack_card.line.color.rgb = CARD_BORDER

    tb_stack = s6.shapes.add_textbox(Inches(1.0), Inches(1.9), Inches(4.1), Inches(4.6))
    tf = tb_stack.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "CORE TECHNOLOGIES"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = DARK_RED

    stack_items = [
        ("React 19 + TypeScript 5.7", "Type-safe concurrent UI components"),
        ("Vite 6 Build System", "1.3s compilation, sub-second HMR"),
        ("Tailwind CSS v4", "High-contrast, light-mode locked theme"),
        ("Web Speech API", "Zero-dependency client-side Kannada TTS"),
        ("Vitest Test Suite", "38 automated unit tests passing"),
        ("Custom SVG Vector Map", "Interactive 6-zone Karnataka cartography"),
    ]
    for name, desc in stack_items:
        p2 = tf.add_paragraph()
        p2.text = f"• {name}: {desc}"
        p2.font.size = Pt(11)
        p2.font.color.rgb = DARK_STONE

    # Right: Architecture Flow
    arch_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.6), Inches(1.7), Inches(6.9), Inches(5.0))
    arch_card.fill.solid()
    arch_card.fill.fore_color.rgb = WHITE
    arch_card.line.color.rgb = RGBColor(226, 232, 240)

    tb_arch = s6.shapes.add_textbox(Inches(5.8), Inches(1.9), Inches(6.5), Inches(4.6))
    tf_arch = tb_arch.text_frame
    tf_arch.word_wrap = True
    p = tf_arch.paragraphs[0]
    p.text = "DATA FLOW & SUBSYSTEM ARCHITECTURE"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = DARK_RED

    flow_text = """
[ USER INTERACTION ]
  • 5-Step Trip Wizard OR 1-Click Circuit Presets (Hampi / Coorg / Coast)
       │
       ▼
[ DETERMINISTIC SMART ITINERARY ENGINE ]
  • Resolves Duration (1-7D) & Budget Multiplier (Backpacker/Comfort/Luxury)
  • Queries Verified ASI/KSTDC Dataset (20+ Locations)
  • Applies Western Ghats Pass & Day-driving Constraints
       │
       ▼
[ MULTI-DIMENSIONAL ENRICHMENT LAYER ]
  • Dynamic Route Polyline Generation (SVG Coordinate Mapping)
  • Food Trail Pairing (6 Regional Cultural Zones)
  • Kannada Situational Audio Phrase Binding (Web Speech API)
       │
       ▼
[ INTERACTIVE DASHBOARD & EXPORT ]
  • Day-by-Day Timeline • SVG Route Map • 1-Click Print/PDF Export
"""
    p2 = tf_arch.add_paragraph()
    p2.text = flow_text
    p2.font.size = Pt(11)
    p2.font.color.rgb = DARK_STONE

    # ==============================================================
    # SLIDE 7: Section 6 — Conclusion, Impact & Future Roadmap
    # ==============================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_slide_header(s7, "Conclusion: Real-World Impact & Future Roadmap", "Section 6 • Impact & Roadmap")

    conc_cards = [
        ("Real-World Impact", "• Cultural Bridge: Connects non-Kannada tourists directly to authentic spoken Kannada.\n• Economic Boost: Directs travelers to local khanavalis, heritage sweet marts, and estate homestays rather than generic corporate chains.\n• Zero Failure Demo: Completely immune to venue Wi-Fi drops with instant sub-50ms execution."),
        ("Production Readiness", "• 38 Passing Vitest Tests ensuring schema stability and calculation fidelity.\n• Clean 1.3s Production Build (385 kB minified bundle).\n• 1-Click Print / PDF export for offline travelers in zero-connectivity forest zones."),
        ("Future Roadmap", "• Phase 1: Integration with KSRTC live bus booking API for public transit routing.\n• Phase 2: Crowdsourced audio verification allowing native dialect speakers to contribute local pronunciations.\n• Phase 3: PWA offline caching with GPS-triggered arrival audio guides.")
    ]

    for i, (title, content) in enumerate(conc_cards):
        left = Inches(0.8 + i * 3.9)
        top = Inches(1.7)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER

        tb = s7.shapes.add_textbox(left + Inches(0.25), top + Inches(0.25), Inches(3.2), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = DARK_RED

        p2 = tf.add_paragraph()
        p2.text = content
        p2.font.size = Pt(12)
        p2.font.color.rgb = DARK_STONE

    # Save to disk
    output_path = "YatriKa_AI_Karnataka_Travel_Planner_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_yatrika_presentation()
