export const ecologyRoot = '/exams/csir-net/life-sciences/ecology/';
export const ecologySections = [
 ['A','Ecology foundations and environment','ecology-foundations-and-environment',[
  ['Ecology and levels of organisation','Scope of ecology; organisms, populations, communities, ecosystems and the biosphere.'],
  ['Physical environment','Temperature, light, water, soil, salinity, pH and oxygen.'],
  ['Ecological factors and organism responses','Biotic influences, conditions versus resources, and interacting environmental factors.'],
  ['Limiting factors and tolerance','Liebig’s law, Shelford’s law and interpretation of tolerance curves.'],
  ['Ecological adaptations','Structural, physiological and behavioural adaptations; acclimation and evolutionary change.']]],
 ['B','Habitat and niche','habitat-and-niche',[
  ['Habitat and ecological niche','Habitat, niche concepts and multidimensional environmental requirements.'],
  ['Fundamental and realised niches','Environmental limits, biotic restrictions and experimental evidence.'],
  ['Niche breadth and overlap','Specialists, generalists, resource-use distributions and quantitative interpretation.'],
  ['Resource partitioning and character displacement','Mechanisms, examples and the evidence needed to distinguish them.']]],
 ['C','Population ecology','population-ecology',[
  ['Population attributes','Abundance, density, dispersion, age structure and sex ratio.'],
  ['Population estimation','Quadrats, transects, mark–recapture, sampling and assumptions.'],
  ['Population growth','Geometric, exponential and logistic growth: equations and graphs.'],
  ['Population regulation','Density dependence, density independence, carrying capacity and Allee effects.'],
  ['Life tables and demographic measures','Survival, mortality, fecundity and demographic calculations.'],
  ['Survivorship and age structure','Survivorship curves, age distributions and population projections.'],
  ['Life-history strategies','Trade-offs, reproductive schedules, semelparity, iteroparity and the r/K framework.'],
  ['Metapopulations','Patches, dispersal, colonisation, local extinction, connectivity and rescue effects.']]],
 ['D','Species interactions','species-interactions',[
  ['Types of species interactions','Interaction signs, context and direct versus indirect effects.'],
  ['Competition and coexistence','Intraspecific and interspecific competition, exclusion, models and isoclines.'],
  ['Predator–prey interactions','Functional responses, population cycles, refuges and models.'],
  ['Herbivory and plant defence','Consumer–plant interactions, resistance and defence trade-offs.'],
  ['Parasitism and host–parasite interactions','Transmission, host effects, resistance and ecological outcomes.'],
  ['Mutualism and other interactions','Pollination, facilitation, commensalism and amensalism.']]],
 ['E','Community ecology','community-ecology',[
  ['Community structure and attributes','Composition, dominance, stratification and relative abundance.'],
  ['Diversity concepts','Species richness, evenness and alpha, beta and gamma diversity.'],
  ['Measuring diversity','Shannon and Simpson measures, calculations and interpretation.'],
  ['Species roles and community organisation','Food webs, keystone and foundation species, and ecosystem engineers.'],
  ['Ecotones and edge effects','Community boundaries, transitions and ecological consequences.'],
  ['Stability and disturbance','Resistance, resilience and diversity–stability relationships.']]],
 ['F','Ecological succession','ecological-succession',[
  ['Types of succession','Primary, secondary, autogenic and allogenic succession.'],
  ['Mechanisms of succession','Facilitation, inhibition, tolerance and species replacement.'],
  ['Successional changes and trajectories','Changes through time, alternative trajectories and climax concepts.']]],
 ['G','Ecosystem ecology','ecosystem-ecology',[
  ['Ecosystem structure and function','Components, pools, fluxes and organism–environment connections.'],
  ['Energy transfer and ecological pyramids','Trophic pathways, food chains and transfer efficiencies.'],
  ['Primary production','GPP, NPP, environmental controls and measurement.'],
  ['Secondary production and efficiencies','Consumption, assimilation, production and numerical interpretation.'],
  ['Decomposition','Stages, decomposers, litter quality and environmental controls.'],
  ['Biogeochemical cycles','Carbon, nitrogen, phosphorus and water: reservoirs and transfers.'],
  ['Indian ecosystems','Forests, grasslands, freshwater, marine and estuarine systems.'],
  ['Ecosystem services','Ecological functions, benefits and links to human well-being.']]],
 ['H','Biogeography','biogeography',[
  ['Distributions, biomes and climate','Large-scale patterns and environmental controls.'],
  ['Island biogeography','Immigration, extinction, area, isolation and species–area relationships.'],
  ['Indian biogeographic patterns','Zones, habitats, endemism and species distributions.']]],
 ['I','Human impacts and applied ecology','human-impacts-and-applied-ecology',[
  ['Pollution and ecological effects','Eutrophication, bioaccumulation and biomagnification.'],
  ['Climate and global change','Ecological responses, range shifts and phenology.'],
  ['Land use and habitat change','Fragmentation, degradation, connectivity and restoration.'],
  ['Biological invasions','Arrival, establishment, impacts and management.']]],
 ['J','Biodiversity and conservation','biodiversity-and-conservation',[
  ['Biodiversity levels and assessment','Documentation, assessment and monitoring.'],
  ['Threats, extinction and risk categories','Drivers of biodiversity loss and interpretation of IUCN categories.'],
  ['Conservation genetics','Small populations, drift, inbreeding and management.'],
  ['Population viability analysis','Demographic and environmental stochasticity, risk and models.'],
  ['In situ conservation','Protected areas, landscapes, community participation and indigenous knowledge.'],
  ['Ex situ conservation','Captive breeding, reintroduction, gardens, seed banks and cryopreservation.']]],
 ['K','Laws, policies and agricultural biodiversity','laws-policies-and-agricultural-biodiversity',[
  ['Indian biodiversity and environmental legislation','Biodiversity, wildlife and environmental frameworks; legal details checked when authored.'],
  ['International conservation frameworks','Conventions, treaties, their purposes and scope.'],
  ['Agricultural biodiversity and plant genetic resources','Genebanks, genetic-resource conservation and plant-variety protection.']]],
 ['L','Behavioural ecology','behavioural-ecology',[
  ['Proximate and ultimate explanations','Mechanisms, function, development and inherited or learned behaviour.'],
  ['Foraging behaviour','Optimal-foraging models, costs, benefits and experimental interpretation.'],
  ['Communication','Signals, channels, information and reliability.'],
  ['Conflict and resource defence','Aggression, territoriality, contests and dominance.'],
  ['Movement and navigation','Migration, dispersal, orientation, navigation and habitat selection.'],
  ['Social behaviour','Cooperation, altruism, kin selection, inclusive fitness and reciprocity.'],
  ['Reproductive behaviour','Sexual selection, mating systems, investment and parental care.']]]
].map(([code,title,slug,rows])=>({
 code,title,slug,url:ecologyRoot+code.toLowerCase()+'-'+slug+'/',
 notes:rows.map(([title,description],i)=>({
  id:code+(i+1),title,description,section:code,
  available:code==='A'&&i<3,
  url:ecologyRoot+(code+(i+1)).toLowerCase()+'-'+title.toLowerCase().normalize('NFKD').replace(/[–—]/g,'-').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'/'
 }))
}));
export const ecologyNotes = ecologySections.flatMap(section=>section.notes);
export const ecologyA1 = ecologyNotes[0];
export const ecologyA2 = ecologyNotes[1];
export const ecologyA3 = ecologyNotes[2];
