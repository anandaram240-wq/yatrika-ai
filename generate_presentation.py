import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette
    DARK_RED = RGBColor(153, 27, 27)    # #991b1b (Karnataka Crimson)
    GOLD_AMBER = RGBColor(217, 119, 6)   # #d97706 (Karnataka Haldi Gold)
    DARK_STONE = RGBColor(28, 25, 23)   # #1c1917 (Background / Text)
    MUTED_GRAY = RGBColor(120, 113, 108) # #78716c
    CARD_BG = RGBColor(254, 252, 232)    # Warm cream / amber-50
    WHITE = RGBColor(255, 255, 255)
    LIGHT_BG = RGBColor(250, 250, 249)

    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title_text, category_text):
        # Header ribbon
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
        shape.fill.solid()
        shape.fill.fore_color.rgb = DARK_RED
        shape.line.fill.background()

        # Category tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.4))
        tf = cat_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category_text.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = GOLD_AMBER

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = DARK_STONE

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = RGBColor(28, 25, 23)
    bg1.line.fill.background()

    # Red & Yellow accent bars
    bar_red = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.25), Inches(5.1))
    bar_red.fill.solid()
    bar_red.fill.fore_color.rgb = DARK_RED
    bar_red.line.fill.background()

    bar_gold = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.1), Inches(1.2), Inches(0.15), Inches(5.1))
    bar_gold.fill.solid()
    bar_gold.fill.fore_color.rgb = GOLD_AMBER
    bar_gold.line.fill.background()

    title_box = slide1.shapes.add_textbox(Inches(1.5), Inches(1.3), Inches(11), Inches(4.8))
    tf1 = title_box.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "KANNADA DIGITAL INNOVATION HACKATHON 2026"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GOLD_AMBER

    p2 = tf1.add_paragraph()
    p2.text = "Namma Kannada (ನಮ್ಮ ಕನ್ನಡ)"
    p2.font.size = Pt(40)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "Regional Language & Dialect Explorer"
    p3.font.size = Pt(28)
    p3.font.bold = True
    p3.font.color.rgb = RGBColor(251, 191, 36)

    p4 = tf1.add_paragraph()
    p4.text = "Problem Statement 04: Documenting & exploring regional variations of Kannada, local expressions, audio cadence, and cultural heritage."
    p4.font.size = Pt(15)
    p4.font.color.rgb = RGBColor(214, 211, 209)
    p4.space_before = Pt(20)

    p5 = tf1.add_paragraph()
    p5.text = "Organized by HackerRank Campus Crew • The National Institute of Engineering (NIE), Mysuru\nTheme: Code. Create. Celebrate Kannada."
    p5.font.size = Pt(12)
    p5.font.color.rgb = RGBColor(168, 162, 158)
    p5.space_before = Pt(30)

    # -------------------------------------------------------------
    # SLIDE 2: Problem Statement
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Problem Statement & Context", "Section 01 • The Challenge")

    # Card 1: The Core Issue
    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = RGBColor(254, 240, 138)
    tf = c1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Linguistic Homogenization"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Textbooks and digital tools teach only standardized 'Granthika' Kannada.\n\n• Regional spoken variations like Kundagannada, Dharwadi, Mandya rustic, and Kalyana Kannada are absent from mainstream tech platforms.\n\n• Young speakers are losing touch with ancestral idioms, metaphors, and folklore."
    p2.font.size = Pt(13)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    # Card 2: Who Is Affected
    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = RGBColor(254, 240, 138)
    tf = c2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Who Is Affected?"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Non-Kannadigas & Migrants: Baffled when moving across Karnataka because local auto drivers, vendors, and colleagues don't speak textbook Kannada.\n\n• Native Kannadigas: Misunderstandings between regions (e.g. Uttara Karnataka directness mistaken for anger; Kundapra jokes misinterpreted).\n\n• Cultural Historians: Urgent need to archive oral dialects before they fade."
    p2.font.size = Pt(13)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    # Card 3: Why It Matters
    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c3.fill.solid()
    c3.fill.fore_color.rgb = CARD_BG
    c3.line.color.rgb = RGBColor(254, 240, 138)
    tf = c3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Why It Matters"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Language is identity: Karnataka's beauty lies in 'ಒಂದೊಂದು ಮೈಲಿಗೆ ಒಂದೊಂದು ರಾಗ' (a new tune every mile).\n\n• True digital empowerment must respect regional diversity, not erase it.\n\n• Fosters linguistic harmony, empathy, and tourism connection across all 31 districts of Karnataka."
    p2.font.size = Pt(13)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    # -------------------------------------------------------------
    # SLIDE 3: Existing Systems & Their Gaps
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "Existing Systems & Critical Gaps", "Section 02 • Competitive Landscape")

    # Table comparing existing systems
    t_shape = slide3.shapes.add_table(4, 4, Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.8))
    table = t_shape.table

    # Column widths
    table.columns[0].width = Inches(2.3)
    table.columns[1].width = Inches(3.1)
    table.columns[2].width = Inches(3.1)
    table.columns[3].width = Inches(3.2)

    headers = ["Platform Type", "Current Solution", "Critical Limitation", "Namma Kannada Edge"]
    for col_idx, text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = DARK_RED
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = WHITE

    rows_data = [
        ("Language Learning Apps (Duolingo, etc.)", "Focus on single standard dialect with English prompts", "Completely ignores regional slang, tone nuance, and situational dialect shifts", "6 parallel regional dialect variations with dual-script transliteration"),
        ("Google Translate & AI Translators", "Direct grammatical translation into standard formal Kannada", "Sounds mechanical; unable to translate colloquialisms like 'Haudla', 'En Marre', 'Boliya'", "Context-aware vernacular matrix showing exact regional emotional nuances"),
        ("Online Dictionaries & Wikipedia", "Static, text-only encyclopedic definitions", "No phonetic audio pronunciations, no gamification, no community contribution pipeline", "Live Web Speech API pronunciation + gamified quiz + crowdsourced vault")
    ]

    for row_idx, row in enumerate(rows_data, start=1):
        for col_idx, text in enumerate(row):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG if row_idx % 2 == 1 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.size = Pt(12)
            p.font.color.rgb = DARK_STONE

    # -------------------------------------------------------------
    # SLIDE 4: How Our Solution Is Different
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "How Our Solution Is Different", "Section 03 • Core Innovation")

    diff_features = [
        ("🗺️ 6-Zone Dialect Map", "Comprehensive linguistic coverage spanning Uttara Karnataka, Karavali/Kundapura, Mysuru-Mandya, Kalyana Karnataka, Malenadu, and Bengaluru Urban with district tagging."),
        ("🔄 Cross-Dialect Matrix", "World's first comparative situational transformer: view how one thought or situation translates across all 6 regions side-by-side with phonetic transliteration."),
        ("🔊 Interactive Speech & Audio", "Integrated Web Speech API with regional pitch/rate modulation and audio fallback so anyone can listen to native pronunciations in one click."),
        ("🎯 Dialect Guesser Game", "Gamified audio challenge that tests users' ability to recognize Karnataka's regional accents, rewarding them with cultural trivia and scores."),
        ("✍️ Crowdsourced Community Vault", "Empowers Kannadigas across villages and cities to submit local words, idioms, meanings, and sentences with JSON export for open linguistic research.")
    ]

    for idx, (title, desc) in enumerate(diff_features):
        top_pos = 1.8 + idx * 1.05
        box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_pos), Inches(11.7), Inches(0.92))
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = RGBColor(229, 231, 235)
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(14)
        p.font.color.rgb = DARK_RED
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = DARK_STONE
        p2.space_before = Pt(2)

    # -------------------------------------------------------------
    # SLIDE 5: Technical Architecture & Methodology
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "Technical Architecture & Data Flow", "Section 04 • Implementation")

    # Architecture diagram container
    arch_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.1))
    arch_box.fill.solid()
    arch_box.fill.fore_color.rgb = LIGHT_BG
    arch_box.line.color.rgb = RGBColor(214, 211, 209)
    tf = arch_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "ARCHITECTURE & WORKFLOW PIPELINE"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = GOLD_AMBER

    p2 = tf.add_paragraph()
    p2.text = """
1. FRONTEND LAYER:
   • React 19 + TypeScript: Modern component architecture, type-safe linguistic models, zero runtime exceptions.
   • Tailwind CSS: Karnataka heritage theme (Crimson Red #991b1b, Haldi Gold #d97706), responsive across mobile, tablet, and desktop.
   • Lucide React: Crisp semantic iconography for clean UX.

2. LINGUISTIC ENGINE & DATA LAYER:
   • Curated Dialect Data Models: Structured schema supporting regional IDs, phonetic transliteration, grammatical nuances, and cultural origins.
   • Cross-Dialect Matrix Engine: Real-time contextual phrase matching across 6 linguistic zones.
   • Namma Shabda Kosha: Rich local slang glossary filterable by region, tags, and text search.

3. SPEECH & INTERACTION LAYER:
   • Web Speech API Synthesis Engine: Native Kannada (kn-IN) synthesis with adaptive phonetic fallback and dialect pitch/speed calibration.
   • Speech Recognition Practice: Real-time voice capture with phonetic similarity scoring.
   • Canvas-Confetti Gamification: Rewarding streaks and positive reinforcement in the Dialect Guesser.

4. CROWDSOURCING & PERSISTENCE LAYER:
   • LocalStorage Reactive State + JSON Export: Instant offline persistence and downloadable dialect archives for open cultural research.
"""
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 6: Conclusion & Future Scope
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Impact, Conclusion & Future Roadmap", "Section 05 • Looking Ahead")

    # Box 1: Impact Today
    b1 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    b1.fill.solid()
    b1.fill.fore_color.rgb = CARD_BG
    b1.line.color.rgb = RGBColor(254, 240, 138)
    tf1 = b1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Project Impact & Real-World Value"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = DARK_RED

    p2 = tf1.add_paragraph()
    p2.text = "• Cultural Preservation: Documents endangered regional expressions (Kundagannada, Arebhashe, North Karnataka idioms) in a digital vault.\n\n• Bridge for Non-Kannadigas: Empowers non-native residents, students, and tourists to understand true local vernaculars in everyday life.\n\n• Mutual Empathy: Celebrates every corner of Karnataka — fostering regional unity through linguistic appreciation.\n\n• Zero Barrier to Entry: Runs in any modern browser without heavy downloads or expensive proprietary APIs."
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    # Box 2: Future Scope
    b2 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    b2.fill.solid()
    b2.fill.fore_color.rgb = CARD_BG
    b2.line.color.rgb = RGBColor(254, 240, 138)
    tf2 = b2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Future Scope & Next Steps"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = DARK_RED

    p2 = tf2.add_paragraph()
    p2.text = "• AI Dialect Conversational Tutor: Fine-tune open-source Kannada LLM on regional corpus to simulate real-time conversational auto drivers, shopkeepers, and elders.\n\n• Voice Sample Crowd-Recording: Enable Kannadigas to record and upvote authentic native voice clips for every word.\n\n• Mobile PWA / App with Offline Pack: Full offline dialect survival guide for travellers in remote Western Ghats and rural districts.\n\n• School Curriculum Integration: Educational modules for Karnataka state schools to cultivate pride in linguistic heritage."
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    prs.save("/Users/ananda/Downloads/HACKTHON/Namma_Kannada_Regional_Explorer_Presentation.pptx")
    print("Successfully generated Namma_Kannada_Regional_Explorer_Presentation.pptx")

if __name__ == "__main__":
    create_presentation()
