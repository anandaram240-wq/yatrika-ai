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
    p2.font.size = Pt(38)
    p2.font.bold = True
    p2.font.color.rgb = WHITE
    p2.space_before = Pt(10)

    p3 = tf1.add_paragraph()
    p3.text = "Evidence-Graded Regional Language & Dialect Explorer"
    p3.font.size = Pt(26)
    p3.font.bold = True
    p3.font.color.rgb = RGBColor(251, 191, 36)

    p4 = tf1.add_paragraph()
    p4.text = "Problem Statement 04: Regional Language Explorer • Phase 3 Release-Critical Remediation\n13 Seed Candidate Entries • 5 Core Communicative Concepts • Strict Bibliographic & Provenance Registry"
    p4.font.size = Pt(13)
    p4.font.color.rgb = RGBColor(214, 211, 209)
    p4.space_before = Pt(18)

    p5 = tf1.add_paragraph()
    p5.text = "Organized by HackerRank Campus Crew • The National Institute of Engineering (NIE), Mysuru\nTheme: Code. Create. Celebrate Kannada."
    p5.font.size = Pt(12)
    p5.font.color.rgb = RGBColor(168, 162, 158)
    p5.space_before = Pt(26)

    # -------------------------------------------------------------
    # SLIDE 2: Problem Statement & Reconciled Dataset
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Linguistic Ground Truth & Reconciled Candidate Dataset", "Section 01 • The Problem & Data Model")

    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = RGBColor(254, 240, 138)
    tf = c1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "The Linguistic Problem"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Spoken Kannada changes its cadence, vocabulary, and verbal morphology every 30–100 km across Karnataka.\n\n• Standard translation engines and apps homogenize speech into literary Granthika Kannada.\n\n• Naive hackathons invent fake AI dialect scores and forced 6-region translations, fabricating nonexistent dialect words."
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = RGBColor(254, 240, 138)
    tf = c2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Reconciled Seed Dataset"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Reconciled: 13 Candidate Entries across 5 Concepts (resolving Argon's 12-entry discrepancy).\n\n• Concept 2 ('What are you doing?') has 4 entries (std, kittur, kalyana, coastal-malnad).\n\n• All 13 entries are provisional (E4 phrase / E2 pattern) with null locators pending physical page verification.\n\n• Zero fabricated citations or artificial speaker reviews."
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c3.fill.solid()
    c3.fill.fore_color.rgb = CARD_BG
    c3.line.color.rgb = RGBColor(254, 240, 138)
    tf = c3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Schema & Semantic Integrity"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• JSON Schema Draft 2020-12: Full schema validation via Ajv with zero errors.\n\n• 6 Semantic Validation Rules: Bibliographic registry checks, locator verification, regional attribution, register validation, Unicode Kannada range, and speaker consent.\n\n• Sparse Matrix States: Supports shared baselines and honest empty states."
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    # -------------------------------------------------------------
    # SLIDE 3: Comparison Matrix & Sparse Handling
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "Sparse 6-Region Comparator & Matrix States", "Section 02 • Core Architecture")

    t_shape = slide3.shapes.add_table(5, 3, Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.8))
    table = t_shape.table
    table.columns[0].width = Inches(2.6)
    table.columns[1].width = Inches(4.5)
    table.columns[2].width = Inches(4.6)

    headers = ["Matrix State Type", "Visual Treatment & Rendering", "Linguistic Rationale"]
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
      ("distinct_regional_variant", "Full regional card with Kannada script, ISO-15919 transliteration, learner phonetics, and sub-variety tag.", "Used when a region has a verified distinct dialect reflex (e.g. Kittur progressive '-akattiri')."),
      ("documented_multi_region", "Regional card with badge 'Shared Across Multiple Regions (e.g. Kittur & Kalyana)'.", "Reflects macro-regional isogloss sharing rather than falsely labeling a shared form as exclusive to one city."),
      ("shared_with_standard", "Muted card displaying linked baseline entry with badge 'Uses Standard / Pan-Karnataka Form'.", "Honors the reality that many regions use standard Kannada forms for specific communicative situations."),
      ("no_verified_distinct_variant", "Explicit honest empty state card with explanatory note and research backlog status.", "Eliminates synthetic dialect fabrication; non-attested regions are preserved as transparent empty states.")
    ]

    for row_idx, row in enumerate(rows_data, start=1):
      for col_idx, text in enumerate(row):
        cell = table.cell(row_idx, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = CARD_BG if row_idx % 2 == 1 else WHITE
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.size = Pt(11.5)
        p.font.color.rgb = DARK_STONE

    # -------------------------------------------------------------
    # SLIDE 4: Audio & Speech Integrity
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "Audio Authenticity & Deterministic Spoken Recall Check", "Section 03 • Speech & Verification")

    diff_features = [
      ("🔊 Honest Standard Audio Readout", "Labeled strictly as 'Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording'. Pitch (1.0) and rate (0.95) are fixed. Region-based pitch shifting is eliminated."),
      ("🔍 OS Voice Availability Verification", "Checks window.speechSynthesis for an installed kn-IN voice. If absent, disables playback and clearly alerts the user instead of playing distorted english voices."),
      ("🎙️ Spoken Recall Check (Standard kn-IN ASR)", "Replaced fake random score generator with deterministic Levenshtein character distance against captured Web Speech recognition transcripts."),
      ("⚠️ Permanent ASR Dialect Disclaimer", "Prominently discloses: 'Browser Speech-to-Text is trained on Standard Kannada and may normalize or misrecognize regional dialect endings (-akattiri, -likkattiri, -iddiri).'"),
      ("🏷️ Evidence Tier & Quarantined Backlog", "All 13 seed entries are marked Provisional (E2 pattern / E4 phrase). 15 legacy glossary items are quarantined under Unverified (E5) status pending manual book lookups.")
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
      p.font.size = Pt(13.5)
      p.font.color.rgb = DARK_RED
      p2 = tf.add_paragraph()
      p2.text = desc
      p2.font.size = Pt(11)
      p2.font.color.rgb = DARK_STONE
      p2.space_before = Pt(2)

    # -------------------------------------------------------------
    # SLIDE 5: Technical Stack & Testing Benchmarks
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "Technical Stack, Quality Benchmarks & Vitest Suite", "Section 04 • Implementation & Quality")

    arch_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.1))
    arch_box.fill.solid()
    arch_box.fill.fore_color.rgb = LIGHT_BG
    arch_box.line.color.rgb = RGBColor(214, 211, 209)
    tf = arch_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "RIGOROUS TECHNICAL EXECUTION & TEST AUTOMATION"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = GOLD_AMBER

    p2 = tf.add_paragraph()
    p2.text = """
1. FULL STATIC TYPE SAFETY & SCHEMA VALIDATION:
   • React 19 + TypeScript 5.7: Strict verification types (E1-E5, provisional, speaker_reviewed, source_attested).
   • Ajv Draft 2020-12: Full JSON schema validation wired into Vitest automated tests.
   • Semantic Validator: Evaluates all 6 linguistic rules (bibliographic registry, locator, script, register, consent).

2. AUTOMATED VITEST SUITE (19 PASSING TESTS):
   • Test 1-6: Schema Draft 2020-12, 6 Semantic Validation Rules, reconciled 13-entry count, provisional null locators, licensing, sparse matrix states.
   • Test 7-11: Speech service diagnostics, 6-region macro-clusters, zero duplicate IDs, E5 quarantined backlog, quiz options uniqueness.
   • Test 12-15: Zero forbidden synthetic titles in active data, validator rejection of fake titles, zero ungrounded source_attested claims, licensing completeness.
   • Test 16-19: Exact 5 active concepts, Kundagannada candidate provenance, strictly 0 E3 records & removal of uncataloged SRC-BHAT-1967, zero pseudo-corpora.

3. KANNADA TYPOGRAPHY & ACCESSIBILITY:
   • Strict lang="kn" and line-height: 1.65 (leading-loose) across script containers to prevent ottakshara clipping.
   • Zero build errors in Vite production bundle (dist/ gzip: 118 kB).
"""
    p2.font.size = Pt(11)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 6: Fieldwork Vault, Licensing & Conclusion
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Fieldwork Notebook, Licensing Governance & Submission", "Section 05 • Governance & Submission")

    b1 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    b1.fill.solid()
    b1.fill.fore_color.rgb = CARD_BG
    b1.line.color.rgb = RGBColor(254, 240, 138)
    tf1 = b1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Persistence & Licensing Policy"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = DARK_RED
    p2 = tf1.add_paragraph()
    p2.text = "• Local Browser Notebook: Transparently labeled as client localStorage; submissions are tagged as contributor_pending (E3/E4).\n\n• Mandatory CC BY 4.0 Consent: 'I confirm this is my own observation and release this note under CC BY 4.0 without personal identifying data.'\n\n• Schema-Validated JSON Export: Generates downloadable exports formatted under atlas-data.schema.json.\n\n• Retracted Blanket Claims: Removed blanket CC claims for third-party datasets (e.g. Alar uses ODbL v1.0)."
    p2.font.size = Pt(12)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    b2 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    b2.fill.solid()
    b2.fill.fore_color.rgb = CARD_BG
    b2.line.color.rgb = RGBColor(254, 240, 138)
    tf2 = b2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Submission Readiness"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = DARK_RED
    p2 = tf2.add_paragraph()
    p2.text = "• Working Submission Cutoff: 31 October 2026, 10:00 PM IST (~132 hours remaining).\n\n• Public Repository: Clean Git history with checkpoint branches and zero credentials.\n\n• Production Build: TypeScript 5.7 and Vite 6 with zero errors.\n\n• 3-to-5 Min Video Walkthrough Script: Timed 3:45 spoken script included in README.\n\n• Grounded Linguistic Value: True differentiator lies in evidence-graded provenance, not decorative AI."
    p2.font.size = Pt(12)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    prs.save("/Users/ananda/Downloads/HACKTHON/Namma_Kannada_Regional_Explorer_Presentation.pptx")
    print("Successfully generated Phase 2.5 Namma_Kannada_Regional_Explorer_Presentation.pptx")

if __name__ == "__main__":
    create_presentation()
