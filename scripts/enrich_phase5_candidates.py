import json

with open('src/data/atlas-evidence-candidates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('src/data/atlas-data.schema.json', 'r', encoding='utf-8') as f:
    schema = json.load(f)

decompositions = {
    "nka-how-are-you-std": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-pronoun",
                "slot_label": "Pronoun (Honorific)",
                "surface_kn": "ನೀವು",
                "surface_iso": "nīvu",
                "underlying_form": "nīvu",
                "gloss_en": "you (PL/HON)",
                "is_invariant_root": False,
                "shift_category": "pronominal_form",
                "shift_explanation": "Standard 2nd-person plural/honorific pronoun; frequently omitted in spoken colloquial varieties."
            },
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative (Manner)",
                "surface_kn": "ಹೇಗೆ",
                "surface_iso": "hēge",
                "underlying_form": "hēge",
                "gloss_en": "how",
                "is_invariant_root": False,
                "shift_category": "phonological_shift",
                "shift_explanation": "Standard interrogative manner adverb featuring initial /h/ and long vowel /ē/, shifting to /hy/ (ಹ್ಯಾಂಗ) in Northern Karnataka and /he/ (ಹೆಂಗೆ) in Coastal speech."
            },
            {
                "slot_id": "slot-copula-person",
                "slot_label": "Copula + Person Agreement",
                "surface_kn": "ಇದ್ದೀರಿ",
                "surface_iso": "iddīri",
                "underlying_form": "ir- + -t- + -īri",
                "gloss_en": "be.PRES-2PL.HON",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Copular verbal root 'ir-' (to be) inflected for present tense 2nd-person plural/honorific agreement."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-how-are-you-nk-shared": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative (Manner)",
                "surface_kn": "ಹ್ಯಾಂಗ",
                "surface_iso": "hyāṅga",
                "underlying_form": "hēge -> hyāṅga",
                "gloss_en": "how (NK)",
                "is_invariant_root": False,
                "shift_category": "phonological_shift",
                "shift_explanation": "Northern Kannada interrogative with palatal glide /y/ and velar nasal extension (-ṅga), reflecting Old/Medieval Kannada 'hēṅge'."
            },
            {
                "slot_id": "slot-copula-person",
                "slot_label": "Copula + Person Agreement",
                "surface_kn": "ಅದೀರಿ",
                "surface_iso": "adīri",
                "underlying_form": "ad- / ir- + -īri",
                "gloss_en": "be.PRES-2PL.HON",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Northern Kannada copular root 'ad-' (corresponding to Standard 'ir-'), inflected with 2nd-person plural suffix '-īri'."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-how-are-you-coastal-kunda": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative (Manner)",
                "surface_kn": "ಹೆಂಗೆ",
                "surface_iso": "heṅge",
                "underlying_form": "hēge -> heṅge",
                "gloss_en": "how (Coastal)",
                "is_invariant_root": False,
                "shift_category": "phonological_shift",
                "shift_explanation": "Coastal / Kundagannada manner interrogative retaining internal velar nasal assimilation /ṅg/ with short front vowel /e/."
            },
            {
                "slot_id": "slot-copula-person",
                "slot_label": "Copula + Person Agreement",
                "surface_kn": "ಇದ್ದಿರಿ",
                "surface_iso": "iddiri",
                "underlying_form": "ir- + -t- + -iri",
                "gloss_en": "be.PRES-2PL",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Coastal inflection of copular root 'ir-' with short final vowel /-iri/ rather than standard lengthened /-īri/."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-what-doing-std": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative Pronoun",
                "surface_kn": "ಏನು",
                "surface_iso": "ēnu",
                "underlying_form": "ēnu",
                "gloss_en": "what",
                "is_invariant_root": False,
                "shift_category": "pronominal_form",
                "shift_explanation": "Full standard interrogative pronoun 'ēnu'; in spoken colloquial registers reduced to 'ēn'."
            },
            {
                "slot_id": "slot-verb-root",
                "slot_label": "Verb Root (Invariant)",
                "surface_kn": "ಮಾಡು",
                "surface_iso": "māḍu",
                "underlying_form": "māḍu",
                "gloss_en": "do/make",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Invariant Dravidian verbal base 'māḍu' (to do/make), universally shared across all regional varieties."
            },
            {
                "slot_id": "slot-aspect-suffix",
                "slot_label": "Aspect (Progressive)",
                "surface_kn": "-ತ್ತ-",
                "surface_iso": "-tta-",
                "underlying_form": "-utta-",
                "gloss_en": "PROG (durative)",
                "is_invariant_root": False,
                "shift_category": "aspect_morphology",
                "shift_explanation": "Standard Kannada present continuous/durative aspectual infix '-utt- / -tta-'."
            },
            {
                "slot_id": "slot-copula-person",
                "slot_label": "Auxiliary Copula + Person",
                "surface_kn": "ಇದ್ದೀರಿ",
                "surface_iso": "iddīri",
                "underlying_form": "ir- + -īri",
                "gloss_en": "AUX.be-2PL.HON",
                "is_invariant_root": False,
                "shift_category": "auxiliary_person",
                "shift_explanation": "Standard periphrastic auxiliary verb 'ir-' carrying 2nd-person honorific agreement '-īri'."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-what-doing-kittur": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative Pronoun",
                "surface_kn": "ಏನ್",
                "surface_iso": "ēn",
                "underlying_form": "ēnu",
                "gloss_en": "what",
                "is_invariant_root": False,
                "shift_category": "phonological_shift",
                "shift_explanation": "Apocopated colloquial form of interrogative pronoun 'ēnu', universal in spoken Kannada."
            },
            {
                "slot_id": "slot-verb-root",
                "slot_label": "Verb Root (Invariant)",
                "surface_kn": "ಮಾಡ್-",
                "surface_iso": "māḍ-",
                "underlying_form": "māḍu",
                "gloss_en": "do/make",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Invariant Dravidian verbal root 'māḍ-' (to do/make), identical to the standard lexical base."
            },
            {
                "slot_id": "slot-aspect-suffix",
                "slot_label": "Aspect (Kittur Progressive)",
                "surface_kn": "-ಆಕತ್ತ-",
                "surface_iso": "-ākatta-",
                "underlying_form": "-āka + hatti-",
                "gloss_en": "PROG (Kittur compound)",
                "is_invariant_root": False,
                "shift_category": "aspect_morphology",
                "shift_explanation": "Diagnostic Kittur progressive suffix grammaticalized from purposive/infinitive '-āka' + inceptive auxiliary 'hatti-' (clinging/beginning to do)."
            },
            {
                "slot_id": "slot-person-marker",
                "slot_label": "Person Agreement",
                "surface_kn": "-ಈರಿ",
                "surface_iso": "-īri",
                "underlying_form": "-īri",
                "gloss_en": "2PL.HON",
                "is_invariant_root": False,
                "shift_category": "person_marker",
                "shift_explanation": "2nd-person plural/honorific agreement marker attached directly to the synthetic progressive compound."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-what-doing-kalyana": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative Pronoun",
                "surface_kn": "ಏನ್",
                "surface_iso": "ēn",
                "underlying_form": "ēnu",
                "gloss_en": "what",
                "is_invariant_root": False,
                "shift_category": "phonological_shift",
                "shift_explanation": "Apocopated interrogative pronoun 'ēn' common to spoken Northern and standard registers."
            },
            {
                "slot_id": "slot-verb-root",
                "slot_label": "Verb Root (Invariant)",
                "surface_kn": "ಮಾಡ್-",
                "surface_iso": "māḍ-",
                "underlying_form": "māḍu",
                "gloss_en": "do/make",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Invariant Dravidian verbal root 'māḍ-' (to do/make), preserved without lexical change."
            },
            {
                "slot_id": "slot-aspect-suffix",
                "slot_label": "Aspect (Kalyana Progressive)",
                "surface_kn": "-ಲಿಕ್ಕತ್ತ-",
                "surface_iso": "-likkatta-",
                "underlying_form": "-likke + hatti-",
                "gloss_en": "PROG (Kalyana dative)",
                "is_invariant_root": False,
                "shift_category": "aspect_morphology",
                "shift_explanation": "Diagnostic Kalyana Karnataka progressive compound: dative infinitive morpheme '-likke' (in order to do) + auxiliary 'hatti-' (clinging/beginning)."
            },
            {
                "slot_id": "slot-person-marker",
                "slot_label": "Person Agreement",
                "surface_kn": "-ಈರಿ",
                "surface_iso": "-īri",
                "underlying_form": "-īri",
                "gloss_en": "2PL.HON",
                "is_invariant_root": False,
                "shift_category": "person_marker",
                "shift_explanation": "2nd-person plural/honorific person inflection marking respectful address."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-what-doing-coastal-malnad": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative Pronoun",
                "surface_kn": "ಎಂತ",
                "surface_iso": "enta",
                "underlying_form": "enta",
                "gloss_en": "what (Coastal/Malnad)",
                "is_invariant_root": False,
                "shift_category": "lexical_replacement",
                "shift_explanation": "Diagnostic Karavali and Malnad interrogative pronoun 'enta' (what), contrasting with standard 'ēnu'."
            },
            {
                "slot_id": "slot-verb-root",
                "slot_label": "Verb Root (Invariant)",
                "surface_kn": "ಮಾಡ್-",
                "surface_iso": "māḍ-",
                "underlying_form": "māḍu",
                "gloss_en": "do/make",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Invariant Dravidian verbal root 'māḍ-' (to do/make)."
            },
            {
                "slot_id": "slot-aspect-suffix",
                "slot_label": "Aspect (Participle)",
                "surface_kn": "-ತಾ",
                "surface_iso": "-tā",
                "underlying_form": "-utta / -tā",
                "gloss_en": "PROG (participle)",
                "is_invariant_root": False,
                "shift_category": "aspect_morphology",
                "shift_explanation": "Colloquial spoken continuous participial suffix '-tā' common to coastal, Malnad, and informal Southern varieties."
            },
            {
                "slot_id": "slot-copula-person",
                "slot_label": "Auxiliary Copula + Person",
                "surface_kn": "ಇದ್ದಿರಿ",
                "surface_iso": "iddiri",
                "underlying_form": "ir- + -iri",
                "gloss_en": "AUX.be-2PL",
                "is_invariant_root": False,
                "shift_category": "auxiliary_person",
                "shift_explanation": "Auxiliary copula with coastal short vowel inflection /-iri/ rather than standard lengthened /-īri/."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-where-going-std": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative (Allative)",
                "surface_kn": "ಎಲ್ಲಿಗೆ",
                "surface_iso": "ellige",
                "underlying_form": "elli + -ge",
                "gloss_en": "where-DAT (allative)",
                "is_invariant_root": False,
                "shift_category": "case_marking",
                "shift_explanation": "Standard interrogative locative root 'elli' with dative suffix '-ge' indicating destination/allative direction."
            },
            {
                "slot_id": "slot-verb-root",
                "slot_label": "Verb Root (Past Participle)",
                "surface_kn": "ಹೊರಟು-",
                "surface_iso": "horaṭu-",
                "underlying_form": "horaḍu-",
                "gloss_en": "set.out (stem)",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Invariant Dravidian verbal root 'horaḍu' (to set out, depart), with past participial stem 'horaṭu'."
            },
            {
                "slot_id": "slot-copula-person",
                "slot_label": "Auxiliary Copula + Person",
                "surface_kn": "ಇದ್ದೀರಿ",
                "surface_iso": "iddīri",
                "underlying_form": "ir- + -īri",
                "gloss_en": "AUX.be-2PL.HON",
                "is_invariant_root": False,
                "shift_category": "auxiliary_person",
                "shift_explanation": "Present auxiliary copula marking 2nd-person plural/honorific."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-where-going-nk-shared": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-interrogative",
                "slot_label": "Interrogative (Allative)",
                "surface_kn": "ಎಲ್ಲಿಗೆ",
                "surface_iso": "ellige",
                "underlying_form": "elli + -ge",
                "gloss_en": "where-DAT (allative)",
                "is_invariant_root": False,
                "shift_category": "case_marking",
                "shift_explanation": "Shared interrogative allative form 'ellige' (where to)."
            },
            {
                "slot_id": "slot-verb-root",
                "slot_label": "Verb Root (Phonological Shift)",
                "surface_kn": "ಹೊಂಟು-",
                "surface_iso": "hoṇṭu-",
                "underlying_form": "horaḍu -> hoṇṭu",
                "gloss_en": "set.out (nasal assimilation)",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Phonologically shifted root from 'horaḍu': retroflex liquid /r/ undergoes syncopation and nasal assimilation to retroflex stop cluster /ṇṭ/."
            },
            {
                "slot_id": "slot-person-marker",
                "slot_label": "Person Agreement",
                "surface_kn": "-ಈರಿ",
                "surface_iso": "-īri",
                "underlying_form": "-īri",
                "gloss_en": "2PL.HON",
                "is_invariant_root": False,
                "shift_category": "person_marker",
                "shift_explanation": "Direct suffixation of 2nd-person plural/honorific ending without separate explicit auxiliary copula."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-good-fine-std": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-adverbial-stem",
                "slot_label": "Adverbial Base",
                "surface_kn": "ಚೆನ್ನಾಗಿ",
                "surface_iso": "cennāgi",
                "underlying_form": "cennu + -āgi",
                "gloss_en": "fine/pleasant-ADV",
                "is_invariant_root": False,
                "shift_category": "lexical_stem",
                "shift_explanation": "Standard Kannada adjective/noun 'cennu' (beauty, wellness) with adverbial suffix '-āgi'."
            },
            {
                "slot_id": "slot-copula-neuter",
                "slot_label": "Copula (3rd Neuter)",
                "surface_kn": "ಇದೆ",
                "surface_iso": "ide",
                "underlying_form": "ir- + -de",
                "gloss_en": "be.PRES.3SG.NEUT",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Standard 3rd-person singular neuter present copula from root 'ir-' (to be)."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-good-fine-kittur": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-adverbial-stem",
                "slot_label": "Adverbial Base (Northern)",
                "surface_kn": "ಚೊಲೊ",
                "surface_iso": "colo",
                "underlying_form": "cennu -> colo",
                "gloss_en": "good/fine (Northern)",
                "is_invariant_root": False,
                "shift_category": "lexical_replacement",
                "shift_explanation": "Diagnostic Northern Kannada qualitative adjective 'colo' (fine, good, well), cognate with Prakrit / Marathi contact influence."
            },
            {
                "slot_id": "slot-copula-neuter",
                "slot_label": "Copula (3rd Neuter Northern)",
                "surface_kn": "ಐತಿ",
                "surface_iso": "aiti",
                "underlying_form": "ir- -> aiti",
                "gloss_en": "be.PRES.3SG.NEUT (NK)",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Diagnostic Northern Kannada 3rd-person singular neuter copula 'aiti' (it is), corresponding to Standard 'ide'."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-boy-std": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-noun-root",
                "slot_label": "Noun Root",
                "surface_kn": "ಹುಡುಗ",
                "surface_iso": "huḍuga",
                "underlying_form": "huḍuga",
                "gloss_en": "boy/youth",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Universal standard Kannada masculine noun for boy/youth; Dravidian etymon attested across literary and spoken records."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    },
    "nka-boy-coastal-mani": {
        "morpheme_decomposition": [
            {
                "slot_id": "slot-noun-root",
                "slot_label": "Noun Root (Coastal / Havyaka)",
                "surface_kn": "ಮಾಣಿ",
                "surface_iso": "māṇi",
                "underlying_form": "māṇi",
                "gloss_en": "boy/young male (Coastal)",
                "is_invariant_root": True,
                "shift_category": "invariant_root",
                "shift_explanation": "Specialized regional and sociolinguistic noun for boy/youth in Karavali and Malnad (Havyaka, Kundagannada); attested in Kittel (1894:1264) and regional dialect surveys."
            }
        ],
        "evidence_dimensions": {
            "lexical_root": "E1",
            "meaning_equivalence": "E2",
            "grammatical_pattern": "E2",
            "regional_distribution": "E2",
            "exact_sentence_locator": None,
            "native_speaker_review": None
        }
    }
}

for entry in data['entries']:
    eid = entry['id']
    if eid in decompositions:
        entry['morpheme_decomposition'] = decompositions[eid]['morpheme_decomposition']
        entry['evidence_dimensions'] = decompositions[eid]['evidence_dimensions']
    else:
        raise ValueError(f"Missing decomposition for entry: {eid}")

# Validate against schema via node test
print("Enriching dataset...")

with open('src/data/atlas-evidence-candidates.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Saved src/data/atlas-evidence-candidates.json successfully.")
