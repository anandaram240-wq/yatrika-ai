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

    # Red & Gold accent bars
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
    p2.text = "Namma Kannada Atlas (ನಮ್ಮ ಕನ್ನಡ)"
    p2.font.size = Pt(40)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "Grounded Regional Language & Dialect Explorer"
    p3.font.size = Pt(28)
    p3.font.bold = True
    p3.font.color.rgb = RGBColor(251, 191, 36)

    p4 = tf1.add_paragraph()
    p4.text = "Problem Statement 04: Documenting & exploring regional varieties of Kannada with scholarly citations, isogloss awareness, and open provenance."
    p4.font.size = Pt(14)
    p4.font.color.rgb = RGBColor(214, 211, 209)
    p4.space_before = Pt(20)

    p5 = tf1.add_paragraph()
    p5.text = "Organized by HackerRank Campus Crew • The National Institute of Engineering (NIE), Mysuru\nTheme: Code. Create. Celebrate Kannada."
    p5.font.size = Pt(12)
    p5.font.color.rgb = RGBColor(168, 162, 158)
    p5.space_before = Pt(30)

    # -------------------------------------------------------------
    # SLIDE 2: Problem Statement & Context
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Problem Statement: Linguistic Homogenization vs Regional Reality", "Section 01 • The Problem")

    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = RGBColor(254, 240, 138)
    tf = c1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The Real Problem"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Spoken Kannada changes its cadence, vocabulary, and verbal morphology every 30–100 km across Karnataka.\n\n• Mainstream software, translation engines, and curricula standardize exclusively on formal Granthika Kannada.\n\n• Regional speakers and learners face genuine communicative barriers when encountering northern, coastal, or northeastern vernaculars."
    p2.font.size = Pt(13)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

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
    p2.text = "• Migrants & Students: Unprepared for everyday street conversations with auto drivers, vendors, and colleagues in Dharwad, Kundapura, or Mandya.\n\n• Native Kannadigas: Cross-regional friction (e.g. North Karnataka's energetic directness mistaken for anger; coastal idioms misunderstood).\n\n• Linguists & Cultural Historians: Urgent need to preserve endangered oral vocabulary before it is swallowed by globalized urban slang."
    p2.font.size = Pt(13)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c3.fill.solid()
    c3.fill.fore_color.rgb = CARD_BG
    c3.line.color.rgb = RGBColor(254, 240, 138)
    tf = c3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Scholarly Significance"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Linguistic research (CIIL Mysuru, LDC-IL, Kannada University Hampi) proves Kannada is a rich geographic continuum (isoglosses), not a monolithic block.\n\n• True digital celebration of Kannada requires preserving this dialect continuum with authentic scholarly citations rather than AI hallucinations."
    p2.font.size = Pt(13)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    # -------------------------------------------------------------
    # SLIDE 3: Existing Systems & Their Gaps
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "Existing Systems & Evidence-Supported Gaps", "Section 02 • Competitive Landscape")

    t_shape = slide3.shapes.add_table(4, 4, Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.8))
    table = t_shape.table
    table.columns[0].width = Inches(2.3)
    table.columns[1].width = Inches(3.1)
    table.columns[2].width = Inches(3.1)
    table.columns[3].width = Inches(3.2)

    headers = ["Existing System", "Current Capability", "Evidence-Supported Gap", "Namma Kannada Atlas Approach"]
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
        ("Commercial Translators (Google Translate)", "Grammatical translation to standard literary Kannada", "Fails completely on regional idioms ('Haudla', 'Marre', 'Boliya', 'Beda Bidi'); sounds artificial", "Source-attested comparative matrix showing documented regional phrasing and context"),
        ("Language Learning Apps (Duolingo, Ling)", "Basic flashcards for beginner vocabulary", "Confined to standard Bangalore-Mysore baseline; zero dialect or regional awareness", "Educational taxonomy of 6 zones with isogloss awareness and phonological trait notes"),
        ("Academic Glossaries (CIIL / Hampi / Kittel)", "In-depth philological and dialect dictionaries", "Locked in physical library volumes or static PDFs; zero interactive web tools or audio guides", "Interactive digital atlas with verified citations, phonetic guides, and open JSON export")
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
    add_header(slide4, "Core Innovation: Grounded Linguistic Provenance", "Section 03 • Differentiation")

    diff_features = [
        ("📚 Source-Attested Provenance", "Every public dialect phrase and glossary word is grounded in published literature (CIIL Mysuru, Kannada University Hampi, Kittel Dictionary, or documented surveys)."),
        ("🌐 Dialect Continuum Recognition", "Avoids the false assumption that dialects align with 31 administrative districts. Explicitly explains isoglosses, transition zones, and community sub-dialects."),
        ("🔄 Context-Aware Comparative Matrix", "Compares situational communication side-by-side without forcing artificial 6-column symmetry when a region has no attested parallel."),
        ("🔊 Transparent Audio Synthesis", "Honestly labels browser Web Speech synthesis as a phonetic guide; does not pretend pitch adjustments create a genuine human regional accent."),
        ("✍️ Local Vault & Open JSON Export", "Empowers users to draft contributions stored safely on their local device, exportable to standardized JSON under CC-BY 4.0 for open research.")
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
    add_header(slide5, "Technical Architecture & Data Pipeline", "Section 04 • Implementation")

    arch_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.1))
    arch_box.fill.solid()
    arch_box.fill.fore_color.rgb = LIGHT_BG
    arch_box.line.color.rgb = RGBColor(214, 211, 209)
    tf = arch_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "FULL-STACK ARCHITECTURAL WORKFLOW"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = GOLD_AMBER

    p2 = tf.add_paragraph()
    p2.text = """
1. CLIENT APPLICATION LAYER:
   • React 19 + TypeScript 5.7: Type-safe linguistic schemas ensuring data integrity across components.
   • Tailwind CSS 4.0: Accessible, responsive Karnataka heritage theme (Crimson Red #991b1b, Haldi Gold #d97706).
   • Lucide React: Semantic accessible UI iconography.

2. LINGUISTIC SCHEMA & CITATION LAYER:
   • Typed Provenance Model: Separation of linguistic content from verification status ('source-attested', 'provisional', 'contributor-submitted').
   • Citation References: Tracks title, institution, year, volume/page for each linguistic record.
   • Asymmetrical Matrix Support: Preserves empty states when a region has no attested variant, eliminating hallucinated data.

3. AUDIO & SPEECH PROCESSING:
   • Web Speech API Synthesis Engine: Native kn-IN synthesis with calibrated phonetic fallback and honest diagnostics.
   • Microphone Practice Interface: Transcript matching between user speech and target phrases without simulated fake scores.
   • Canvas-Confetti Gamification: Visual reinforcement in the regional phrase knowledge quiz.

4. PERSISTENCE & RESEARCH EXPORT:
   • Client-Side LocalStorage: Offline draft storage without misleading claims of central multi-user synchronization.
   • Structured JSON Research Export: Downloadable CC-BY 4.0 data payload for institutional language preservation.
"""
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 6: Conclusion & Future Roadmap
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Linguistic Impact & Future Roadmap", "Section 05 • Looking Ahead")

    b1 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    b1.fill.solid()
    b1.fill.fore_color.rgb = CARD_BG
    b1.line.color.rgb = RGBColor(254, 240, 138)
    tf1 = b1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Real-World Impact Today"
    p.font.bold = True
    p.font.size = Pt(18)
    p.font.color.rgb = DARK_RED
    p2 = tf1.add_paragraph()
    p2.text = "• Cultural Preservation: Rescues regional phrases (Kundagannada, Dharwadi, Mandya agrarian idioms) from digital obscurity.\n\n• Educational Accuracy: Eliminates AI hallucinations by grounding every phrase in verifiable scholarly sources.\n\n• Social Harmony: Helps newcomers and native speakers appreciate linguistic diversity across Karnataka without regional prejudice.\n\n• Fully Tested & Open: 6 passing test suites in Vitest with zero build errors and zero external API dependencies."
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

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
    p2.text = "• Native Human Voice Repository: Partner with regional universities and cultural centers to record authentic human native voice clips with verified consent.\n\n• Institutional Backend Moderation: Deploy a secure backend review pipeline for crowdsourced community submissions.\n\n• Micro-Dialect Expansion: Extend documentation to specialized community varieties including Havyaka, Arebhashe, Halakki, and Soliga.\n\n• Open Dataset Integration: Contribute validated regional corpora to Bharatavani and LDC-IL open repositories."
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(14)

    prs.save("/Users/ananda/Downloads/HACKTHON/Namma_Kannada_Regional_Explorer_Presentation.pptx")
    print("Successfully generated audited Namma_Kannada_Regional_Explorer_Presentation.pptx")

if __name__ == "__main__":
    create_presentation()
