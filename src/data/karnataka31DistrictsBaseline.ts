// src/data/karnataka31DistrictsBaseline.ts
export interface KarnatakaDistrictMetadata {
  districtCode: string;
  nameEn: string;
  nameKn: string;
  division: 'Bengaluru' | 'Mysuru' | 'Belagavi' | 'Kalaburagi';
  headquarters: string;
  center: [number, number];
  flagshipDestination: string;
  deepDossierReady: boolean;
}

export const KARNATAKA_31_DISTRICTS: KarnatakaDistrictMetadata[] = [
  { districtCode: 'KA-VJN', nameEn: 'Vijayanagara', nameKn: 'ವಿಜಯನಗರ', division: 'Kalaburagi', headquarters: 'Hosapete', center: [76.3860, 15.2689], flagshipDestination: 'Hampi UNESCO World Heritage Zone', deepDossierReady: true },
  { districtCode: 'KA-MYS', nameEn: 'Mysuru', nameKn: 'ಮೈಸೂರು', division: 'Mysuru', headquarters: 'Mysuru', center: [76.6552, 12.3052], flagshipDestination: 'Mysuru Palace & Chamundi Hill', deepDossierReady: true },
  { districtCode: 'KA-CKM', nameEn: 'Chikkamagaluru', nameKn: 'ಚಿಕ್ಕಮಗಳೂರು', division: 'Mysuru', headquarters: 'Chikkamagaluru', center: [75.7720, 13.3161], flagshipDestination: 'Mullayanagiri & Baba Budangiri', deepDossierReady: true },
  { districtCode: 'KA-KDG', nameEn: 'Kodagu', nameKn: 'ಕೊಡಗು', division: 'Mysuru', headquarters: 'Madikeri', center: [75.7382, 12.4244], flagshipDestination: 'Madikeri & Talakaveri', deepDossierReady: true },
  { districtCode: 'KA-UKD', nameEn: 'Uttara Kannada', nameKn: 'ಉತ್ತರ ಕನ್ನಡ', division: 'Belagavi', headquarters: 'Karwar', center: [74.3188, 14.5479], flagshipDestination: 'Gokarna, Jog Falls & Dandeli', deepDossierReady: true },
  { districtCode: 'KA-BGK', nameEn: 'Bagalkote', nameKn: 'ಬಾಗಲಕೋಟೆ', division: 'Belagavi', headquarters: 'Bagalkote', center: [75.6768, 15.9149], flagshipDestination: 'Badami, Pattadakal & Aihole', deepDossierReady: true },
  { districtCode: 'KA-BLR-U', nameEn: 'Bengaluru Urban', nameKn: 'ಬೆಂಗಳೂರು ನಗರ', division: 'Bengaluru', headquarters: 'Bengaluru', center: [77.5946, 12.9716], flagshipDestination: 'Lalbagh, Bangalore Palace & Vidhana Soudha', deepDossierReady: false },
  { districtCode: 'KA-BLR-R', nameEn: 'Bengaluru Rural', nameKn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ', division: 'Bengaluru', headquarters: 'Devanahalli', center: [77.7066, 13.2467], flagshipDestination: 'Devanahalli Fort & Bhoga Nandeeshwara', deepDossierReady: false },
  { districtCode: 'KA-RMN', nameEn: 'Ramanagara', nameKn: 'ರಾಮನಗರ', division: 'Bengaluru', headquarters: 'Ramanagara', center: [77.2812, 12.7150], flagshipDestination: 'Ramadevara Betta Vulture Sanctuary & Channapatna', deepDossierReady: false },
  { districtCode: 'KA-CBP', nameEn: 'Chikkaballapura', nameKn: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ', division: 'Bengaluru', headquarters: 'Chikkaballapura', center: [77.7279, 13.4355], flagshipDestination: 'Nandi Hills & Lepakshi Corridor', deepDossierReady: false },
  { districtCode: 'KA-KLR', nameEn: 'Kolar', nameKn: 'ಕೋಲಾರ', division: 'Bengaluru', headquarters: 'Kolar', center: [78.1291, 13.1362], flagshipDestination: 'Someshwara Temple & Anthargange', deepDossierReady: false },
  { districtCode: 'KA-TUM', nameEn: 'Tumakuru', nameKn: 'ತುಮಕೂರು', division: 'Bengaluru', headquarters: 'Tumakuru', center: [77.1010, 13.3392], flagshipDestination: 'Devarayanadurga & Madhugiri Monolith', deepDossierReady: false },
  { districtCode: 'KA-CTA', nameEn: 'Chitradurga', nameKn: 'ಚಿತ್ರದುರ್ಗ', division: 'Bengaluru', headquarters: 'Chitradurga', center: [76.4022, 14.2152], flagshipDestination: 'Chitradurga Seven-Ringed Stone Fort', deepDossierReady: false },
  { districtCode: 'KA-DVG', nameEn: 'Davanagere', nameKn: 'ದಾವಣಗೆರೆ', division: 'Bengaluru', headquarters: 'Davanagere', center: [75.9218, 14.4644], flagshipDestination: 'Santhebennur Pushkarani & Kondajji', deepDossierReady: false },
  { districtCode: 'KA-SMG', nameEn: 'Shivamogga', nameKn: 'ಶಿವಮೊಗ್ಗ', division: 'Bengaluru', headquarters: 'Shivamogga', center: [75.5681, 13.9299], flagshipDestination: 'Jog Falls, Keladi & Ikkeri', deepDossierReady: false },
  { districtCode: 'KA-HSN', nameEn: 'Hassan', nameKn: 'ಹಾಸನ', division: 'Mysuru', headquarters: 'Hassan', center: [76.1004, 13.0068], flagshipDestination: 'Belur, Halebidu & Shravanabelagola', deepDossierReady: false },
  { districtCode: 'KA-MDY', nameEn: 'Mandya', nameKn: 'ಮಂಡ್ಯ', division: 'Mysuru', headquarters: 'Mandya', center: [76.8958, 12.5218], flagshipDestination: 'Srirangapatna, Ranganathittu & Melukote', deepDossierReady: false },
  { districtCode: 'KA-CMN', nameEn: 'Chamarajanagara', nameKn: 'ಚಾಮರಾಜನಗರ', division: 'Mysuru', headquarters: 'Chamarajanagara', center: [76.9398, 11.9261], flagshipDestination: 'Bandipur Tiger Reserve & BR Hills', deepDossierReady: false },
  { districtCode: 'KA-DKD', nameEn: 'Dakshina Kannada', nameKn: 'ದಕ್ಷಿಣ ಕನ್ನಡ', division: 'Mysuru', headquarters: 'Mangaluru', center: [74.8560, 12.9141], flagshipDestination: 'Mangaluru Coast, Dharmasthala & Kukke Subramanya', deepDossierReady: false },
  { districtCode: 'KA-UDP', nameEn: 'Udupi', nameKn: 'ಉಡುಪಿ', division: 'Mysuru', headquarters: 'Udupi', center: [74.7421, 13.3409], flagshipDestination: 'Udupi Sri Krishna Matha, Malpe & St. Marys Island', deepDossierReady: false },
  { districtCode: 'KA-BGM', nameEn: 'Belagavi', nameKn: 'ಬೆಳಗಾವಿ', division: 'Belagavi', headquarters: 'Belagavi', center: [74.4977, 15.8497], flagshipDestination: 'Gokak Falls & Kittur Fort', deepDossierReady: false },
  { districtCode: 'KA-DWD', nameEn: 'Dharwad', nameKn: 'ಧಾರವಾಡ', division: 'Belagavi', headquarters: 'Dharwad', center: [75.0078, 15.4589], flagshipDestination: 'Unkal Lake & Chandramouleshwara Temple', deepDossierReady: false },
  { districtCode: 'KA-GDG', nameEn: 'Gadag', nameKn: 'ಗದಗ', division: 'Belagavi', headquarters: 'Gadag-Betageri', center: [75.6350, 15.4315], flagshipDestination: 'Trikuteshwara Temple & Lakkundi Stepwells', deepDossierReady: false },
  { districtCode: 'KA-HVR', nameEn: 'Haveri', nameKn: 'ಹಾವೇರಿ', division: 'Belagavi', headquarters: 'Haveri', center: [75.3991, 14.7951], flagshipDestination: 'Siddhesvara Temple & Blackbuck Sanctuary Ranebennur', deepDossierReady: false },
  { districtCode: 'KA-VJP', nameEn: 'Vijayapura', nameKn: 'ವಿಜಯಪುರ', division: 'Belagavi', headquarters: 'Vijayapura', center: [75.7100, 16.8302], flagshipDestination: 'Gol Gumbaz & Ibrahim Rauza', deepDossierReady: false },
  { districtCode: 'KA-KLB', nameEn: 'Kalaburagi', nameKn: 'ಕಲಬುರಗಿ', division: 'Kalaburagi', headquarters: 'Kalaburagi', center: [76.8343, 17.3297], flagshipDestination: 'Kalaburagi Fort & Sannati Buddhist Stupa', deepDossierReady: false },
  { districtCode: 'KA-BDR', nameEn: 'Bidar', nameKn: 'ಬೀದರ್', division: 'Kalaburagi', headquarters: 'Bidar', center: [77.5197, 17.9104], flagshipDestination: 'Bidar Fort, Mahmud Gawan Madrasa & Karez', deepDossierReady: false },
  { districtCode: 'KA-YDG', nameEn: 'Yadgir', nameKn: 'ಯಾದಗಿರಿ', division: 'Kalaburagi', headquarters: 'Yadgir', center: [77.1376, 16.7702], flagshipDestination: 'Yadgir Hill Fort & Sleeping Buddha Hill', deepDossierReady: false },
  { districtCode: 'KA-RCR', nameEn: 'Raichur', nameKn: 'ರಾಯಚೂರು', division: 'Kalaburagi', headquarters: 'Raichur', center: [77.3566, 16.2076], flagshipDestination: 'Raichur Doab Fort & Mudgal Fort', deepDossierReady: false },
  { districtCode: 'KA-KPL', nameEn: 'Koppal', nameKn: 'ಕೊಪ್ಪಳ', division: 'Kalaburagi', headquarters: 'Koppal', center: [76.1548, 15.3505], flagshipDestination: 'Anegundi, Anjanadri Hill & Mahadeva Temple Itagi', deepDossierReady: false },
  { districtCode: 'KA-BLY', nameEn: 'Ballari', nameKn: 'ಬಳ್ಳಾರಿ', division: 'Kalaburagi', headquarters: 'Ballari', center: [76.9214, 15.1394], flagshipDestination: 'Ballari Hill Fort & Sandur Valley', deepDossierReady: false },
];
