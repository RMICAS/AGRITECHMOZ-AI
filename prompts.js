const agriculturePrompts = {
    sowing: [
        {
            prompt: "What are the best months for sowing [CROP] in Mozambique?",
            answer: "The optimal time for sowing [CROP] in Mozambique depends on the region and rainfall patterns. Generally, the main planting season starts with the onset of reliable rains, typically from November to mid-December. For irrigated [CROP] farming, a secondary planting window exists in March-April. Early planting helps avoid drought stress during critical growth stages and maximizes yield potential."
        },
        {
            prompt: "Which soil preparation techniques are recommended for [CROP] farming?",
            answer: "For successful [CROP] farming, practice deep plowing (20-30cm) before the rainy season, followed by harrowing to break up soil clumps. Incorporate organic matter and create raised beds in areas prone to waterlogging. Maintain soil pH appropriate for [CROP] (generally 6.0-6.5) and consider using cover crops in the off-season to improve soil structure and fertility."
        },
        {
            prompt: "How should I space my [CROP] plants in sandy soils?",
            answer: "In sandy soils, [CROP] plants generally require wider spacing to allow for better root development and moisture conservation. Depending on the variety, maintain appropriate row spacing and plant-to-plant distance. Consider using mulch around plants to retain soil moisture and prevent erosion, which is particularly important in sandy soil conditions."
        },
        {
            prompt: "What are the recommended seed varieties for [CROP] cultivation in Mozambique?",
            answer: "For [CROP] cultivation in Mozambique, drought-resistant and disease-tolerant varieties are recommended. Local varieties adapted to Mozambican conditions often perform well when planted early in the season. Consult with local agricultural extension officers for specific variety recommendations based on your region, as performance can vary significantly across Mozambique's diverse growing zones."
        },
        {
            prompt: "How deep should I plant [CROP] seeds in coastal areas?",
            answer: "In coastal areas of Mozambique, plant [CROP] seeds at an appropriate depth based on seed size - generally 2-5cm for medium-sized seeds. For sandy coastal soils, plant slightly deeper to ensure good moisture contact. Ensure proper soil preparation and avoid planting in waterlogged conditions, which is particularly important in coastal regions with higher humidity."
        },
        {
            prompt: "What's the best practice for [CROP] sowing in lowland areas?",
            answer: "In lowland areas, [CROP] sowing practices should account for potential water accumulation. Consider raised beds or ridges to improve drainage. Time planting to avoid periods of flooding, and select varieties adapted to lowland conditions. Proper field leveling and drainage channels are essential for uniform growth and to prevent waterlogging damage to young [CROP] plants."
        },
        {
            prompt: "How can I prepare my field for [CROP] planting?",
            answer: "Prepare fields for [CROP] by clearing vegetation and plowing to appropriate depth. Create seedbeds suited to [CROP] seed size. Add organic matter and ensure good drainage. Plant at the start of reliable rains unless irrigation is available. Consider soil testing to determine specific nutrient requirements for optimal [CROP] growth in your specific field conditions."
        },
        {
            prompt: "What's the recommended sowing depth for [CROP]?",
            answer: "The recommended sowing depth for [CROP] depends on seed size and soil type. As a general rule, plant seeds at a depth of 2-3 times their diameter. In heavy soils, plant more shallowly; in sandy soils, plant slightly deeper. Ensure good seed-to-soil contact for optimal germination and emergence of [CROP] seedlings."
        },
        {
            prompt: "When is the best time to sow [CROP] in green belt areas?",
            answer: "In green belt areas of Mozambique, [CROP] is best sown during periods that avoid extreme heat and heavy rains. For many crops, the period from March to August (cool season) works well. For year-round production, consider using shade nets during summer and ensure good irrigation systems. Timing should be adjusted based on the specific growth requirements of [CROP]."
        },
        {
            prompt: "What soil amendments are needed before sowing [CROP]?",
            answer: "Before sowing [CROP], apply well-decomposed manure or compost to improve soil structure and fertility. Add lime if soil is acidic, adjusting to the pH requirements of [CROP]. Incorporate appropriate NPK fertilizer during final land preparation. Consider soil testing to determine specific nutrient requirements for optimal [CROP] growth in your soil conditions."
        }
    ],
    growth: [
        {
            prompt: "How often should I irrigate [CROP] during dry season?",
            answer: "During the dry season, [CROP] typically requires regular irrigation to maintain optimal growth. The frequency depends on soil type, plant stage, and weather conditions. Generally, irrigate deeply but less frequently to encourage deep root development. Use drip irrigation or water at the base of plants early morning or evening to minimize evaporation loss and disease risk in your [CROP] field."
        },
        {
            prompt: "What are the signs of nitrogen deficiency in [CROP] plants?",
            answer: "Nitrogen deficiency in [CROP] plants typically shows as yellowing of older leaves, starting from the tip and moving along the midrib in a V-pattern. Plants appear stunted with thin stems and reduced growth rate. Apply appropriate nitrogen fertilizer when symptoms appear, preferably after rain or irrigation for better uptake. Split applications are recommended for more efficient nutrient use in [CROP] production."
        },
        {
            prompt: "How can I control pests in [CROP] farms without chemicals?",
            answer: "For organic pest control in [CROP] farms, implement integrated approaches such as intercropping with pest-repellent plants, using neem extract sprays, encouraging natural predators by maintaining biodiversity, and using physical barriers. Regular monitoring allows early detection and intervention. Crop rotation and maintaining healthy soil also contribute to stronger [CROP] plants that can better resist pest attacks."
        },
        {
            prompt: "What's the best practice for [CROP] management during growth?",
            answer: "Best practices for [CROP] management during growth include regular monitoring for pests and diseases, appropriate watering, timely weeding, and proper nutrient management. Depending on the crop, practices like pruning, staking, or thinning may be necessary. Maintain field hygiene and implement preventative measures rather than reactive treatments for optimal [CROP] development and yield."
        },
        {
            prompt: "How do I identify and treat common diseases in [CROP]?",
            answer: "Common diseases in [CROP] can be identified by characteristic symptoms such as leaf spots, wilting, discoloration, or abnormal growth. For effective management, practice crop rotation, use disease-free planting material, maintain field hygiene, and ensure proper spacing for air circulation. Early detection through regular monitoring is crucial. For specific diseases, targeted organic or chemical treatments may be necessary depending on severity and [CROP] tolerance."
        },
        {
            prompt: "What fertilizer schedule should I follow for [CROP]?",
            answer: "For [CROP], apply basal fertilizer during planting, focusing on phosphorus and potassium for root development. Follow with nitrogen-focused top-dressing during vegetative growth stages. The exact timing and formulation depend on soil fertility, [CROP] requirements, and growth stage. Split applications are often more effective than single heavy doses, especially in sandy soils or high-rainfall areas."
        },
        {
            prompt: "How can I improve [CROP] productivity?",
            answer: "To improve [CROP] productivity, implement integrated management practices including proper variety selection, optimal planting density, timely pest and disease control, and appropriate nutrient and water management. Regular monitoring allows for timely interventions. Soil health maintenance through organic matter addition and proper crop rotation also contributes significantly to sustained [CROP] productivity over multiple seasons."
        },
        {
            prompt: "What's the recommended weed control method for [CROP]?",
            answer: "Weed control in [CROP] is best achieved through integrated approaches. Start with proper land preparation and consider mulching to suppress weeds. Timely manual or mechanical weeding during critical early growth stages prevents competition. For larger areas, appropriate pre-emergence herbicides may be used. The specific approach depends on [CROP] growth habits, weed pressure, and available resources."
        },
        {
            prompt: "How should I support [CROP] plants during growth?",
            answer: "Supporting [CROP] plants during growth may involve staking, trellising, or creating appropriate structures depending on the crop type. Install supports early to avoid root damage. The support system should be strong enough to handle the weight of mature plants and potential wind stress. Proper support improves air circulation, light exposure, and can significantly increase both yield and quality of [CROP]."
        },
        {
            prompt: "What are the critical stages for irrigating [CROP]?",
            answer: "Critical irrigation stages for [CROP] typically include establishment after planting, flowering, and fruit/seed development. Water stress during these periods can significantly reduce yield and quality. Monitor soil moisture and plant indicators to determine irrigation timing. The amount and frequency depend on soil type, climate conditions, and the specific water requirements of [CROP] at different growth stages."
        }
    ],
    harvest: [
        {
            prompt: "How do I determine the right time to harvest [CROP]?",
            answer: "The right time to harvest [CROP] is determined by specific indicators of maturity, which vary by crop type. Look for visual cues such as color changes, size development, and physical characteristics. For some crops, days after planting or flowering can be a reliable guide. Harvesting at optimal maturity ensures maximum yield, quality, and storage potential for your [CROP]."
        },
        {
            prompt: "What's the best method for harvesting and drying [CROP]?",
            answer: "The best method for harvesting [CROP] depends on the crop type, scale of production, and available resources. Harvest during appropriate weather conditions and time of day to maximize quality. For drying, ensure proper ventilation, temperature control, and protection from contamination. The drying method should reduce moisture content to safe storage levels while preserving the quality characteristics of [CROP]."
        },
        {
            prompt: "How should I harvest and store [CROP] to prevent spoilage?",
            answer: "To prevent spoilage, harvest [CROP] at optimal maturity and handle carefully to minimize physical damage. Remove field heat quickly if necessary. Ensure proper drying to recommended moisture levels before storage. Use clean, dry storage containers or structures with good ventilation and protection from pests. Regular monitoring during storage allows early detection of potential issues affecting your stored [CROP]."
        },
        {
            prompt: "What are the indicators for [CROP] harvest readiness?",
            answer: "Indicators for [CROP] harvest readiness include physical characteristics such as size, color, texture, and firmness. Depending on the crop, specific tests like dry matter content or sugar levels may be applicable. Understanding these indicators helps determine the optimal harvest window, balancing maximum yield development with quality and storage potential for your [CROP]."
        },
        {
            prompt: "How do I minimize losses when harvesting [CROP]?",
            answer: "To minimize harvest losses for [CROP], time the harvest appropriately based on crop maturity and weather conditions. Use proper harvesting techniques and well-maintained equipment. Train harvest workers on careful handling practices. Process or store harvested crop promptly under appropriate conditions. Implementing these practices can significantly reduce both quantitative and qualitative losses in your [CROP] harvest."
        },
        {
            prompt: "What's the proper technique for harvesting [CROP]?",
            answer: "The proper technique for harvesting [CROP] involves careful timing, appropriate tools, and gentle handling. Harvest during cooler parts of the day when possible. Use clean, sharp tools designed for the specific crop to minimize damage. Handle produce carefully to avoid bruising or other physical damage that can lead to quality deterioration and reduced storage life of your [CROP]."
        },
        {
            prompt: "How should I handle [CROP] after harvest?",
            answer: "Post-harvest handling of [CROP] should focus on maintaining quality and extending shelf life. Remove field heat quickly if necessary. Clean, sort, and grade produce according to market requirements. Package appropriately to prevent damage during transport and storage. Maintain the cold chain if required. Proper post-harvest handling significantly impacts the marketability and value of your [CROP]."
        },
        {
            prompt: "What's the best time and method for [CROP] picking?",
            answer: "The best time for picking [CROP] is typically early morning when temperatures are cool but after dew has dried. This timing helps maintain freshness and quality. The specific method depends on the crop type, ranging from hand picking to mechanical harvesting. Select the approach that minimizes damage while maximizing efficiency for your scale of [CROP] production."
        },
        {
            prompt: "How do I know when to harvest [CROP]?",
            answer: "Determining when to harvest [CROP] requires understanding crop-specific maturity indicators. These may include visual cues (color, size), physical tests (firmness, ease of separation), or time-based measures (days after planting or flowering). Harvesting at optimal maturity ensures the best balance of yield, quality, flavor, and storage potential for your [CROP]."
        },
        {
            prompt: "What are the best practices for [CROP] harvesting?",
            answer: "Best practices for [CROP] harvesting include proper timing based on maturity indicators, harvesting during appropriate weather and temperature conditions, using clean and well-maintained equipment, gentle handling to prevent damage, and prompt post-harvest processing or storage. Training harvest workers on these practices helps ensure consistent quality and minimize losses in your [CROP] production."
        }
    ],
    financial: [
        {
            prompt: "How do I calculate the production costs for 1 hectare of [CROP]?",
            answer: "To calculate production costs for 1 hectare of [CROP], include all inputs: seeds/seedlings, fertilizers, pesticides, labor (land preparation, planting, weeding, spraying, harvesting), irrigation, machinery, transport, and storage. Also factor in fixed costs like land rent and depreciation of equipment. Creating a detailed budget with all these components will give you an accurate picture of the total investment needed for [CROP] production."
        },
        {
            prompt: "What's the expected return on investment for [CROP] farming?",
            answer: "The return on investment for [CROP] farming depends on yield potential, market prices, production costs, and management efficiency. Calculate ROI by subtracting total costs from gross revenue (yield × market price), then dividing by total costs and multiplying by 100. For perennial [CROP], consider the establishment period before full production. Good agricultural practices and market timing can significantly improve ROI for your [CROP] enterprise."
        },
        {
            prompt: "How can I access agricultural credit for [CROP] farming?",
            answer: "To access agricultural credit for [CROP] farming, approach agricultural banks, microfinance institutions, government agricultural funds, or farmer cooperatives. Prepare a solid business plan showing projected costs, yields, and returns. Land documents, farming experience proof, and sometimes crop insurance may be required. Joining farmer groups can improve access terms. Various credit products are available with different interest rates and repayment schedules suited for [CROP] production cycles."
        },
        {
            prompt: "What's the cost-benefit analysis of irrigation systems for [CROP]?",
            answer: "A cost-benefit analysis of irrigation for [CROP] should compare the initial investment and ongoing costs against increased yields, quality improvements, and potential for off-season production. Different systems (drip, sprinkler, flood) have varying costs, efficiency, and suitability for [CROP]. Consider water availability, energy costs, and system lifespan. The payback period varies by crop value, yield increase, and system type, typically ranging from 2-5 years for most commercial [CROP] operations."
        },
        {
            prompt: "How should I price my [CROP] for markets?",
            answer: "When pricing [CROP] for markets, research current market rates while considering your production costs to ensure profitability. Factor in quality, seasonality, organic certification (if applicable), and target market (local markets, supermarkets, exports). Value addition through sorting, grading, packaging, or processing can command premium prices. Differentiation strategies and direct marketing can help achieve better prices for your [CROP] compared to standard commodity pricing."
        },
        {
            prompt: "What insurance options are available for [CROP] farmers?",
            answer: "Insurance options for [CROP] farmers include crop insurance covering yield losses from weather events, pests, or diseases; revenue insurance protecting against price fluctuations; and index insurance based on weather patterns rather than actual losses. Government-subsidized programs may be available. Contract farming arrangements sometimes include partial risk coverage. The availability and terms vary by region and crop type, so research specific options for [CROP] in your area."
        },
        {
            prompt: "How do I develop a business plan for [CROP] farming?",
            answer: "A comprehensive business plan for [CROP] farming should include market analysis, production plan, marketing strategy, operational details, and financial projections. Outline startup costs, operating expenses, expected yields, and revenue forecasts. Include risk management strategies and contingency plans. The financial section should show cash flow, break-even analysis, and projected profitability. A well-structured business plan is essential for securing financing and guiding your [CROP] farming enterprise."
        },
        {
            prompt: "What are the most profitable markets for selling [CROP]?",
            answer: "Profitable markets for [CROP] include direct-to-consumer channels (farmers markets, CSAs), institutional buyers (schools, hospitals), restaurants, specialty retailers, and export markets depending on crop type and quality. Value-added processing can open additional market opportunities. Research market requirements, certification needs, and price points. Building relationships with buyers and understanding their specific needs can help secure premium prices for your [CROP]."
        },
        {
            prompt: "How can I reduce production costs for [CROP] farming?",
            answer: "To reduce [CROP] production costs, implement efficient resource management: optimize fertilizer and pesticide use through soil testing and IPM; improve water efficiency with appropriate irrigation systems; mechanize operations where cost-effective; use cover crops to reduce input needs; implement crop rotation to break pest cycles; and consider bulk purchasing inputs through farmer groups. Maintaining detailed records helps identify areas for cost reduction without compromising [CROP] yield or quality."
        },
        {
            prompt: "What government subsidies are available for [CROP] farmers in Mozambique?",
            answer: "Government support for [CROP] farmers in Mozambique may include input subsidies (seeds, fertilizers), credit programs with favorable terms, extension services, irrigation development support, and market access initiatives. The National Agricultural Investment Plan and other programs offer various incentives. Eligibility and available programs vary by region and farm size. Contact local agricultural offices or extension services for current information on subsidies applicable to [CROP] production in your specific area."
        }
    ]
};
