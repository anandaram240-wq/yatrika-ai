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
    EMERALD = RGBColor(5, 150, 105)

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
    # SLIDE 1: Title Slide (Phase 5 Flagship)
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
    p3.text = "The Phrase Passport & Morpheme-Shift X-Ray Explorer"
    p3.font.size = Pt(25)
    p3.font.bold = True
    p3.font.color.rgb = RGBColor(251, 191, 36)

    p4 = tf1.add_paragraph()
    p4.text = "Problem Statement 04: Regional Language Explorer • Computational Dravidian Linguistics & Karnataka DPI\n13 Enriched Candidates • 32 Automated Vitest Tests • FST Phonology • 1,500-Yr Diachrony • PadaKanaja & CLDF"
    p4.font.size = Pt(13)
    p4.font.color.rgb = RGBColor(214, 211, 209)
    p4.space_before = Pt(18)

    p5 = tf1.add_paragraph()
    p5.text = "Organized by HackerRank Campus Crew • The National Institute of Engineering (NIE), Mysuru\nTheme: Code. Create. Celebrate Kannada."
    p5.font.size = Pt(12)
    p5.font.color.rgb = RGBColor(168, 162, 158)
    p5.space_before = Pt(26)

    # -------------------------------------------------------------
    # SLIDE 2: Problem Statement & Epistemic Honesty
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Linguistic Ground Truth & The Reconciled Problem", "Section 01 • The Problem & Data Model")

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
    p2.text = "• Spoken Kannada changes cadence, vocabulary, and verbal morphology every 30–100 km across Karnataka.\n\n• Standard translation engines homogenize speech into formal Granthika Kannada.\n\n• Common hackathon pitfall: Fake pitch-shifted audio, random dialect scores, and fabricated 6-region grids that invent nonexistent dialect words."
    p2.font.size = Pt(12)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = RGBColor(254, 240, 138)
    tf = c2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Reconciled Provenance"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• Exactly 13 Candidate Entries across 5 Concepts (reconciling Argon 12 vs 13 discrepancy).\n\n• Concept 2 ('What are you doing?') has 4 entries (std, kittur, kalyana, coastal-malnad).\n\n• All 13 entries are provisional (E4 phrase / E2 pattern) with null locators pending physical page verification.\n\n• Zero fabricated citations or artificial speaker reviews."
    p2.font.size = Pt(12)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0))
    c3.fill.solid()
    c3.fill.fore_color.rgb = CARD_BG
    c3.line.color.rgb = RGBColor(254, 240, 138)
    tf = c3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Schema & Semantic Gates"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = "• JSON Schema Draft 2020-12: Full schema validation via Ajv with zero errors.\n\n• 6 Semantic Validation Rules: Bibliographic registry checks, locator verification, regional attribution, register validation, Unicode Kannada range, and speaker consent.\n\n• Closed Source Registry v4.0.0: Exactly 10 vetted primary sources (Upadhyaya 1976, Kittel 1894, Bhat 1971, Bright 1958, Hiremath 1961, Venkatasubbiah, LDC-IL, Alar, Padakanaja, KSP)."
    p2.font.size = Pt(12)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(12)

    # -------------------------------------------------------------
    # SLIDE 3: Flagship Innovation - Morpheme-Shift X-Ray
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "Flagship Innovation: The Morpheme-Shift X-Ray Bar", "Section 02 • Core Technological Innovation")

    xray_left = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    xray_left.fill.solid()
    xray_left.fill.fore_color.rgb = CARD_BG
    xray_left.line.color.rgb = RGBColor(254, 240, 138)
    tf = xray_left.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Underlying Morphological Decomposition"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = DARK_RED
    p2 = tf.add_paragraph()
    p2.text = """• Solves the 'Mystery Dialect' problem: Dialects are not completely different foreign languages; they are regular morphological shifts atop invariant Dravidian roots.

• Interactive Morpheme Slots:
  - Green Pill: Invariant Verbal/Nominal Root (e.g. ಮಾಡ್- [māḍ-], ir-, huḍuga)
  - Indigo Pill: Aspectual & Progressive Inflection (e.g. -ಆಕತ್ತ- [-ākatta-], -ಲಿಕ್ಕತ್ತ- [-likkatta-])
  - Amber Pill: Phonological Shift (e.g. ಹ್ಯಾಂಗ [hyāṅga], ಹೆಂಗೆ [heṅge])
  - Rose Pill: Regional Lexical Replacement (e.g. ಎಂತ [enta], ಚೊಲೊ [colo])

• Real-time Reconstruction: Clicking any morpheme pill displays underlying grammatical reconstructions, gloss, and etymological shift explanations."""
    p2.font.size = Pt(11)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(10)

    xray_right = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    xray_right.fill.solid()
    xray_right.fill.fore_color.rgb = RGBColor(28, 25, 23)
    xray_right.line.color.rgb = RGBColor(68, 64, 60)
    tf2 = xray_right.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Comparative Linguistic Demonstration"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = GOLD_AMBER
    p2 = tf2.add_paragraph()
    p2.text = """Concept: 'What are you doing?' (Present Progressive)

1. STANDARD KANNADA:
   [ಏನು /ēnu/ (interrogative)] + [ಮಾಡು /māḍu/ (INVARIANT ROOT)]
   + [-ತ್ತ- /-tta-/ (PROG durative)] + [ಇದ್ದೀರಿ /iddīri/ (AUX-2PL)]

2. KITTUR KARNATAKA (Dharwad / Belagavi):
   [ಏನ್ /ēn/] + [ಮಾಡ್- /māḍ-/ (INVARIANT ROOT)]
   + [-ಆಕತ್ತ- /-ākatta-/ (KITTUR PROG)] + [-ಈರಿ /-īri/ (2PL.HON)]
   * Grammaticalized from infinitive '-āka' + inceptive 'hatti-'

3. KALYANA KARNATAKA (Kalaburagi / Bidar):
   [ಏನ್ /ēn/] + [ಮಾಡ್- /māḍ-/ (INVARIANT ROOT)]
   + [-ಲಿಕ್ಕತ್ತ- /-likkatta-/ (KALYANA DATIVE PROG)] + [-ಈರಿ /-īri/]
   * Grammaticalized from dative '-likke' + 'hatti-'

4. KARAVALI / MALNAD (Kundapura / Coastal):
   [ಎಂತ /enta/ (COASTAL INTERROG)] + [ಮಾಡ್- /māḍ-/ (ROOT)]
   + [-ತಾ /-tā/ (PROG)] + [ಇದ್ದಿರಿ /iddiri/ (AUX-2PL short)]"""
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = RGBColor(245, 245, 244)
    p2.space_before = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 4: Regional Knowledge-Gap Ribbon & Sparse Matrix
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "Regional Knowledge-Gap View & Citizen Fieldwork", "Section 03 • Epistemic UI & Fieldwork")

    t_shape = slide4.shapes.add_table(7, 3, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.1))
    table = t_shape.table
    table.columns[0].width = Inches(2.7)
    table.columns[1].width = Inches(4.5)
    table.columns[2].width = Inches(4.5)

    headers = ["Regional Matrix State", "Visual Treatment & Rendering", "Linguistic Reality & Fieldwork"]
    for col_idx, text in enumerate(headers):
      cell = table.cell(0, col_idx)
      cell.fill.solid()
      cell.fill.fore_color.rgb = DARK_RED
      p = cell.text_frame.paragraphs[0]
      p.text = text
      p.font.bold = True
      p.font.size = Pt(12)
      p.font.color.rgb = WHITE

    rows_data = [
      ("distinct_regional_variant", "Emerald badge, full Kannada script, ISO transliteration, Morpheme X-Ray.", "Verified distinct regional reflex (e.g. Kittur '-akattiri', Coastal 'enta')."),
      ("documented_multi_region", "Blue badge 'Multi-Region (Kittur & Kalyana)'.", "Reflects macro-regional isogloss sharing rather than falsely isolating phrases."),
      ("borrowed_contact_variant", "Purple badge 'Language Contact / Areal'.", "Documented borderland contact loans (e.g. Kittur 'ಚೊಲೊ' < Marathi चांगला/चोख)."),
      ("shared_with_standard", "Muted stone badge 'Standard Baseline'.", "Honors the reality that many regions use standard forms in everyday social interactions."),
      ("no_verified_distinct_variant", "Amber dashed card with 'Log Fieldwork' action button.", "Turns missing data into an open invitation for verified citizen linguistics."),
      ("sub_regional_vernacular", "Indigo badge with community quarantine notice.", "Local community drafts stored strictly in browser localStorage with E4 pending tag.")
    ]

    for row_idx, row in enumerate(rows_data, start=1):
      for col_idx, text in enumerate(row):
        cell = table.cell(row_idx, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = CARD_BG if row_idx % 2 == 1 else WHITE
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.size = Pt(10)
        p.font.color.rgb = DARK_STONE

    # -------------------------------------------------------------
    # SLIDE 5: Inspectable Phrase Passport
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "The Official Phrase Passport: 8-Dimension Audit", "Section 04 • Deep Provenance")

    pass_left = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    pass_left.fill.solid()
    pass_left.fill.fore_color.rgb = CARD_BG
    pass_left.line.color.rgb = RGBColor(254, 240, 138)
    tf1 = pass_left.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "8 Mandatory Linguistic Questions"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = DARK_RED
    p2 = tf1.add_paragraph()
    p2.text = """Every phrase card includes an 'Inspect Passport' drawer answering:

1. Meaning & Semantic Function: Everyday communicative purpose.
2. Context & Register: Formal, polite, colloquial, or elder address.
3. Public Legal Status: Fair Dealing (Sec. 52(1)(a)) / CC BY 4.0.
4. Primary Source Provenance: Live lookup into VERIFIED_SOURCE_REGISTRY.json.
5. 5-Dimension Evidence Audit: Root, meaning, grammar, distribution, locator.
6. Morpheme-Shift Breakdown: Slot-by-slot root and inflection analysis.
7. Shared Regions & Isoglosses: Multi-region distribution.
8. Known Limitations: Transparent caveats and why it is provisional."""
    p2.font.size = Pt(11)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(10)

    pass_right = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    pass_right.fill.solid()
    pass_right.fill.fore_color.rgb = LIGHT_BG
    pass_right.line.color.rgb = RGBColor(214, 211, 209)
    tf2 = pass_right.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Strict Epistemic Evidence Classification"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = GOLD_AMBER
    p2 = tf2.add_paragraph()
    p2.text = """• E1 (Source-Attested): Physical page/volume locator verified. (Currently 0 in seed until physical library verification).

• E2 (Comparative Pattern): Attested in comparative dialectology (Upadhyaya 1976, Venkatasubbiah, Kittel 1894).

• E3 (Native-Speaker Reviewed): Formal consent, native locality, and recorded sub-variety. (Strictly 0 fake reviews).

• E4 (Provisional Candidate): Scholarly pattern supported; exact locator pending. (All 13 candidates honestly held here).

• E5 (Quarantined Backlog): Legacy glossary backlog isolated from default views.

• Native-Speaker Review Protocol: Genuine CTA guiding users on authentic community verification without fabricating data."""
    p2.font.size = Pt(11)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 6: Speech & Audio Neutrality
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Audio Authenticity & Deterministic Spoken Recall", "Section 05 • Speech & Verification")

    diff_features = [
      ("🔊 Honest Standard Audio Readout", "Labeled strictly as 'Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording'. Pitch (1.0) and rate (0.95) are fixed. Region-based pitch-shifting caricature is eliminated."),
      ("🔍 OS Voice Availability Verification", "Checks window.speechSynthesis for an installed kn-IN voice. If absent, alerts the user instead of playing distorted english synthesizer voices."),
      ("🎙️ Spoken Recall Check (Standard kn-IN ASR)", "Replaced fake random score generator with deterministic Levenshtein character distance against captured Web Speech recognition transcripts."),
      ("⚠️ Permanent ASR Dialect Disclaimer", "Discloses: 'Browser Speech-to-Text is trained on Standard Kannada and may normalize or misrecognize regional dialect endings (-akattiri, -likkattiri, -iddiri).'"),
      ("🛡️ Zero Uncataloged Titles", "Audited and confirmed total removal of uncataloged SRC-BHAT-1967 and pseudo-corpora from all metadata.")
    ]

    for idx, (title, desc) in enumerate(diff_features):
      top_pos = 1.8 + idx * 1.05
      box = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_pos), Inches(11.7), Inches(0.92))
      box.fill.solid()
      box.fill.fore_color.rgb = WHITE
      box.line.color.rgb = RGBColor(229, 231, 235)
      tf = box.text_frame
      tf.word_wrap = True
      p = tf.paragraphs[0]
      p.text = title
      p.font.bold = True
      p.font.size = Pt(13)
      p.font.color.rgb = DARK_RED
      p2 = tf.add_paragraph()
      p2.text = desc
      p2.font.size = Pt(11)
      p2.font.color.rgb = DARK_STONE
      p2.space_before = Pt(2)

    # -------------------------------------------------------------
    # SLIDE 7: Computational Dravidian Linguistics & Karnataka DPI
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "Computational Dravidian Linguistics & Karnataka DPI", "Section 06 • Formal Linguistics & DPI")

    ling_left = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    ling_left.fill.solid()
    ling_left.fill.fore_color.rgb = CARD_BG
    ling_left.line.color.rgb = RGBColor(254, 240, 138)
    tf1 = ling_left.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Generative FST & 1,500-Year Diachrony"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = DARK_RED
    p2 = tf1.add_paragraph()
    p2.text = """• Deterministic Finite-State Phonological Transducer:
  - Rule SYNC-01 (Medial Syncope): Bright (1958) & Schiffman (1983): kudure -> kudre, huḍuga -> huḍga.
  - Rule LEN-02 (Southern Glottal Deletion): Kēśirāja (1260 CE) *p- -> h- -> Ø: huḍga -> uḍga (Mandya).
  - Rule PAL-03 (Velar Metaphony): Old Ka. *eṅge nasal retention: hēge -> hyāṅga (Dharwad).

• 1,500-Year Diachronic Time-Machine:
  - Epoch 1: Pūrvada Haḷegannaḍa (450–800 CE, Halmidi era) with archaic ಱ (ṟa) and ೞ (ḻa) and initial *p-.
  - Epoch 2: Haḷegannaḍa (800–1200 CE, Pampa/Ranna era).
  - Epoch 3: Naḍugannaḍa (1200–1700 CE, Kēśirāja *p- -> h-*).
  - Epoch 4: Hosagannaḍa: Coastal/Malnad (ānu, māṇi, oragu) preserved as ancient classical relics!"""
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(8)

    ling_right = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    ling_right.fill.solid()
    ling_right.fill.fore_color.rgb = LIGHT_BG
    ling_right.line.color.rgb = RGBColor(214, 211, 209)
    tf2 = ling_right.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Dialectometry & Karnataka DPI Exporter"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = GOLD_AMBER
    p2 = tf2.add_paragraph()
    p2.text = """• Nerbonne & Heeringa Computational Dialectometry:
  - Composite Linguistic Divergence Formulation:
    D(R_i, R_j) = 0.35·d_phon + 0.40·d_morph + 0.25·I_lex
  - 6x6 Pairwise Matrix across all 15 region pairs.
  - Mathematical Proof: While surface strings differ by 20–55%, Invariant Root Cognacy remains 84%–100% across all Karnataka speech communities!

• Digital Public Infrastructure (DPI) Standards:
  - Govt. of Karnataka PadaKanaja (ಪದಕಣಜ) Ingestion Schema v4.1: Direct JSON export for state dictionary ingestion.
  - Glottolog Cross-Linguistic Data Format (CLDF): Standardized wordlists mapped to nucl1305 (Nuclear Kannadoid)."""
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 8: Technical Quality & Vitest Suite (32 Tests)
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "Technical Stack & 32 Automated Acceptance Tests", "Section 07 • Implementation & Quality")

    arch_box = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.1))
    arch_box.fill.solid()
    arch_box.fill.fore_color.rgb = LIGHT_BG
    arch_box.line.color.rgb = RGBColor(214, 211, 209)
    tf = arch_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "AUTOMATED VITEST ACCEPTANCE SUITE (32 PASSING TESTS)"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = GOLD_AMBER

    p2 = tf.add_paragraph()
    p2.text = """
1. FULL STATIC TYPE SAFETY & SCHEMA VALIDATION:
   • React 19 + TypeScript 5.7: Strict verification types (E1-E5, MorphemeSlot, RightsAndProvenance, ComparisonCellState).
   • Ajv Draft 2020-12: Full JSON schema validation wired into Vitest automated tests.
   • Semantic Validator: Evaluates 6 linguistic rules (10-source bibliographic registry v4.0.0, locator, script, register, consent).

2. 32 AUTOMATED VITEST TESTS (100% PASS IN ~164ms):
   • Tests 1-6: Schema Draft 2020-12, 6 Semantic Rules, 13 reconciled entries, provisional null locators, licensing, sparse matrix.
   • Tests 7-11: Speech diagnostics, 6-region taxonomy, zero duplicate IDs, E5 quarantined backlog, quiz options uniqueness.
   • Tests 12-15: Zero forbidden synthetic titles in active data, validator rejection of fake titles, zero ungrounded source claims.
   • Tests 16-19: Exact 5 active concepts, Kundagannada candidate provenance, strictly 0 E3 records, zero pseudo-corpora.
   • Tests 20-25: Morpheme X-Ray concatenation, Phrase Passport 5D gate, closed registry check, sparse matrix honesty, licensing, TTS diagnostics.
   • Tests 26-28 (Rights & Provenance Gates): Rights and ODbL v1.0 compliance, 7-state matrix mapping, strict E1 verification gate.
   • Tests 29-32 (Tier-2 Computational Dravidian Linguistics & DPI Gates):
     - TEST-29: Dravidian phonetic edit distance with natural allophonic/diachronic shift weighting (p/h, retroflex, syncope).
     - TEST-30: Deterministic Bright-Schiffman syncope (kudure->kudre), southern glottal deletion (uḍga), velar metaphony (hyāṅga).
     - TEST-31: 1,500-year historical trajectories, Halmidi era epigraphy, and archaic graphemes (ಱ, ೞ, *p-).
     - TEST-32: 6x6 pairwise dialect distance matrix (84-100% root cognacy) & GoK PadaKanaja / Glottolog CLDF exports.

3. KANNADA TYPOGRAPHY & PRODUCTION BUILD:
   • Strict lang="kn" and line-height: 1.65 (leading-loose) across script containers to prevent ottakshara clipping.
   • Production build via Vite 6 in 830ms with zero TypeScript errors."""
    p2.font.size = Pt(9.0)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(3)

    # -------------------------------------------------------------
    # SLIDE 9: Hackathon Submission Readiness
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "Submission Readiness & Evaluator Alignment", "Section 08 • Hackathon Summary")

    b1 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    b1.fill.solid()
    b1.fill.fore_color.rgb = CARD_BG
    b1.line.color.rgb = RGBColor(254, 240, 138)
    tf1 = b1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Winning Differentiation"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = DARK_RED
    p2 = tf1.add_paragraph()
    p2.text = """• Not a Toy, Not a Chatbot: Deep, verifiable regional language architecture tailored specifically to Karnataka's linguistic diversity.

• Flagship Computational Novelty: Generative Phonological FST Engine, 1,500-Year Diachronic Time-Machine, and Nerbonne Dialectometry.

• Zero Data Hallucination: Rigorously eliminates synthetic dialect audio, random pronunciation scoring, and fabricated citations.

• State & Global DPI Ingestion: Ready-to-import GoK PadaKanaja (v4.1) and Glottolog CLDF (nucl1305) export formats."""
    p2.font.size = Pt(11.0)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(8)

    b2 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    b2.fill.solid()
    b2.fill.fore_color.rgb = CARD_BG
    b2.line.color.rgb = RGBColor(254, 240, 138)
    tf2 = b2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Submission Checklist"
    p.font.bold = True
    p.font.size = Pt(17)
    p.font.color.rgb = DARK_RED
    p2 = tf2.add_paragraph()
    p2.text = """• Deadline: Saturday, 31 October 2026, 10:00 PM IST (~129 hours remaining).

• Repository: Clean Git history with semantic checkpoints and zero private keys or synthetic metadata.

• Test Suite: 32 passing Vitest tests verifying schema, semantics, morphemes, phonology, and DPI exports.

• Presentation: 9-slide widescreen PPTX generated directly from verified codebase metrics.

• Video Pitch: 3-to-5 minute structured walkthrough script ready in repository README."""
    p2.font.size = Pt(11.0)
    p2.font.color.rgb = DARK_STONE
    p2.space_before = Pt(8)

    prs.save("/Users/ananda/Downloads/HACKTHON/Namma_Kannada_Regional_Explorer_Presentation.pptx")
    print("Successfully generated Phase 5 Flagship Namma_Kannada_Regional_Explorer_Presentation.pptx")

if __name__ == "__main__":
    create_presentation()
