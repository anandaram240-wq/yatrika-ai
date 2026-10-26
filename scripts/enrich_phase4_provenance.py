import json

with open('src/data/atlas-evidence-candidates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

provenance_map = {
    "nka-how-are-you-std": {
        "comparison_cell_state": "shared_with_standard_or_multi_region",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-KITTEL-1894",
            "lexical_source_rights_type": "public_domain_source",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Lexical roots attested in Rev. Ferdinand Kittel (1894), A Kannada-English Dictionary; English explanation and morphological note original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-how-are-you-nk-shared": {
        "comparison_cell_state": "pattern_supported_regional_form",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-UPADHYAYA-1976",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Phonological and copula patterns documented in U. P. Upadhyaya (1976), A Comparative Study of Kannada Dialects; English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-how-are-you-coastal-kunda": {
        "comparison_cell_state": "candidate_awaiting_documentary_verification",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-UPADHYAYA-1976",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Manner interrogative pattern noted in Upadhyaya (1976); full Kundagannada conversational sentence is provisional (E4) pending headword lookup."
        }
    },
    "nka-what-doing-std": {
        "comparison_cell_state": "shared_with_standard_or_multi_region",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-BRIGHT-1958",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Standard progressive aspect documented in William Bright (1958) and standard grammars; English gloss original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-what-doing-kittur": {
        "comparison_cell_state": "pattern_supported_regional_form",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-UPADHYAYA-1976",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Kittur progressive suffix -ākattīri documented in U. P. Upadhyaya (1976) and R. C. Hiremath (1961); English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-what-doing-kalyana": {
        "comparison_cell_state": "pattern_supported_regional_form",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-UPADHYAYA-1976",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Kalyana dative progressive -likkattīri documented in U. P. Upadhyaya (1976) Gulbarga survey; English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-what-doing-coastal-malnad": {
        "comparison_cell_state": "pattern_supported_regional_form",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-BHAT-1971",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Interrogative enta and coastal verb morphology documented in D. N. Shankara Bhat (1971) and Upadhyaya (1976); English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-where-going-std": {
        "comparison_cell_state": "shared_with_standard_or_multi_region",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-KITTEL-1894",
            "lexical_source_rights_type": "public_domain_source",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Root horaḍu attested in Rev. Ferdinand Kittel (1894); English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-where-going-nk-shared": {
        "comparison_cell_state": "pattern_supported_regional_form",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-VENKATASUBBIAH-IGO",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Stem shift horaṭu -> hoṇṭu documented in G. Venkatasubbiah (Igo Kannada) and Upadhyaya (1976); English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-good-fine-std": {
        "comparison_cell_state": "shared_with_standard_or_multi_region",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-KITTEL-1894",
            "lexical_source_rights_type": "public_domain_source",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Stem cennu attested in Rev. Ferdinand Kittel (1894); English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-good-fine-kittur": {
        "comparison_cell_state": "language_contact_or_borrowed_form",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-VENKATASUBBIAH-IGO",
            "lexical_source_rights_type": "copyrighted_reference_factual_citation_only",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Northern contact word cholo and copula aiti documented in G. Venkatasubbiah and Upadhyaya (1976); English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-boy-std": {
        "comparison_cell_state": "shared_with_standard_or_multi_region",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-KITTEL-1894",
            "lexical_source_rights_type": "public_domain_source",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Headword huḍuga attested in Rev. Ferdinand Kittel (1894) and Alar (ODbL 1.0); English gloss original to Namma Kannada Atlas (CC BY 4.0)."
        }
    },
    "nka-boy-coastal-mani": {
        "comparison_cell_state": "pattern_supported_regional_form",
        "rights_and_provenance": {
            "explanatory_text_origin": "original_team_prose",
            "explanatory_text_license": "CC-BY-4.0",
            "lexical_source_id": "SRC-KITTEL-1894",
            "lexical_source_rights_type": "public_domain_source",
            "verbatim_third_party_text_copied": False,
            "redistribution_tier": "approved_for_open_export",
            "attribution_notice": "Headword māṇi attested in Rev. Ferdinand Kittel (1894), Shankara Bhat (1971), and Venkatasubbiah; English explanation original to Namma Kannada Atlas (CC BY 4.0)."
        }
    }
}

for entry in data['entries']:
    eid = entry['id']
    if eid in provenance_map:
        entry['comparison_cell_state'] = provenance_map[eid]['comparison_cell_state']
        entry['rights_and_provenance'] = provenance_map[eid]['rights_and_provenance']

with open('src/data/atlas-evidence-candidates.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Enriched candidate dataset with rights_and_provenance and comparison_cell_state.")
