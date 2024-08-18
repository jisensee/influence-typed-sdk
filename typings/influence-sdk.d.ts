declare module '@influenceth/sdk' {
  type InfluenceEntity = import('../src/api/types').InfluenceEntity

  export type Size = 'Small' | 'Medium' | 'Large' | 'Huge'
  export type SpectralType =
    | 'C'
    | 'S'
    | 'M'
    | 'I'
    | 'Si'
    | 'Sm'
    | 'Cs'
    | 'Ci'
    | 'Cm'
    | 'Cms'
    | 'Cis'

  export type Rarity =
    | 'Common'
    | 'Uncommon'
    | 'Rare'
    | 'Superior'
    | 'Exceptional'
    | 'Incomparable'

  export type BonusType =
    | 'yield'
    | 'fissile'
    | 'metal'
    | 'organic'
    | 'rareearth'
    | 'volatile'

  export type Bonus = {
    position: number
    name: string
    level: 1 | 2 | 3
    modifier: number
    type: BonusType
  }

  export interface OrbitalElements {
    a: number
    e: number
    i: number
    o: number
    w: number
    m: number
  }

  export class AdalianOrbit {
    constructor(orbitalElements: OrbitalElements)

    getPeriod(): number
  }

  export const Asteroid: {
    getBaseName: (asteroidId: number, spectralType: number) => string
    getSize: (radius: number) => Size
    getRarity: (bonuses: Bonus[]) => Rarity
    getSpectralType: (spectralTypeId: number) => SpectralType
    getBonuses: (packedBonuses: number, spectralTypeId: number) => Bonus[]
    getAbundances: (packed: string) => Record<number, number>
    getAbundanceAtLot: (
      asteroidId: number,
      lotIndex: number,
      productId: number,
      abundances: string
    ) => number
    getLotDistance: (
      asteroidId: number,
      originLotIndex: number,
      destLotIndex: number
    ) => number
    getLotTravelTime: (
      asteroidId: number,
      originLotIndex: number,
      destLotIndex: number,
      totalBonus?: number
    ) => number
  }

  export const Entity: {
    packEntity: (params: { id: number; label: number }) => string
    unpackEntity: (uuid: string) => { id: number; label: number }
    IDS: {
      CREW: 1
      CREWMATE: 2
      ASTEROID: 3
      LOT: 4
      BUILDING: 5
      SHIP: 6
      DEPOSIT: 7
      DELIVERY: 9
      SPACE: 10
    }
  }

  export const Lot: {
    toId: (asteroidId: number, lotIndex: number) => number
    toIndex: (lotId: number) => number
    toPosition: (entityorLotId: InfluenceEntity | number) => {
      asteroidId: number
      lotIndex: number
    }
  }

  export type ProductType = {
    i: number
    name: string
    classification: string
    category: string
    massPerUnit: number
    volumePerUnit: number
    isAtomic: boolean
  }

  export const Product: {
    getType: (productId: number) => ProductType
    IDS: {
      WATER: 1
      HYDROGEN: 2
      AMMONIA: 3
      NITROGEN: 4
      SULFUR_DIOXIDE: 5
      CARBON_DIOXIDE: 6
      CARBON_MONOXIDE: 7
      METHANE: 8
      APATITE: 9
      BITUMEN: 10
      CALCITE: 11
      FELDSPAR: 12
      OLIVINE: 13
      PYROXENE: 14
      COFFINITE: 15
      MERRILLITE: 16
      XENOTIME: 17
      RHABDITE: 18
      GRAPHITE: 19
      TAENITE: 20
      TROILITE: 21
      URANINITE: 22
      OXYGEN: 23
      DEIONIZED_WATER: 24
      RAW_SALTS: 25
      SILICA: 26
      NAPHTHA: 27
      SODIUM_BICARBONATE: 28
      IRON: 29
      COPPER: 30
      NICKEL: 31
      QUICKLIME: 32
      ACETYLENE: 33
      AMMONIUM_CARBONATE: 34
      TRIPLE_SUPERPHOSPHATE: 35
      PHOSPHATE_AND_SULFATE_SALTS: 36
      IRON_SULFIDE: 37
      LEAD_SULFIDE: 38
      TIN_SULFIDE: 39
      MOLYBDENUM_DISULFIDE: 40
      FUSED_QUARTZ: 41
      FIBERGLASS: 42
      BARE_COPPER_WIRE: 43
      CEMENT: 44
      SODIUM_CHLORIDE: 45
      POTASSIUM_CHLORIDE: 46
      BORAX: 47
      LITHIUM_CARBONATE: 48
      MAGNESIUM_CHLORIDE: 49
      PROPYLENE: 50
      SULFUR: 51
      STEEL: 52
      SILICON: 53
      NITRIC_ACID: 54
      SULFURIC_ACID: 55
      SOIL: 56
      FERROSILICON: 57
      WEATHERED_OLIVINE: 58
      OXALIC_ACID: 59
      SILVER: 60
      GOLD: 61
      TIN: 62
      IRON_OXIDE: 63
      SPIRULINA_AND_CHLORELLA_ALGAE: 64
      MOLYBDENUM_TRIOXIDE: 65
      SILICA_POWDER: 66
      SOLDER: 67
      FIBER_OPTIC_CABLE: 68
      STEEL_BEAM: 69
      STEEL_SHEET: 70
      STEEL_PIPE: 71
      STEEL_WIRE: 72
      ACRYLONITRILE: 73
      POLYPROPYLENE: 74
      MAGNESIUM: 75
      CHLORINE: 76
      SODIUM_CARBONATE: 77
      CALCIUM_CHLORIDE: 78
      BORIA: 79
      LITHIUM_SULFATE: 80
      HYDROCHLORIC_ACID: 81
      HYDROFLUORIC_ACID: 82
      PHOSPHORIC_ACID: 83
      BORIC_ACID: 84
      ZINC_OXIDE: 85
      NICKEL_OXIDE: 86
      MAGNESIA: 87
      ALUMINA: 88
      SODIUM_HYDROXIDE: 89
      POTASSIUM_HYDROXIDE: 90
      SOYBEANS: 91
      POTATOES: 92
      AMMONIUM_OXALATE: 93
      RARE_EARTH_SULFATES: 94
      FERROCHROMIUM: 95
      YELLOWCAKE: 96
      ALUMINA_CERAMIC: 97
      AUSTENITIC_NICHROME: 98
      COPPER_WIRE: 99
      SILICON_WAFER: 100
      STEEL_CABLE: 101
      POLYACRYLONITRILE: 102
      NATURAL_FLAVORINGS: 103
      PLATINUM: 104
      LITHIUM_CHLORIDE: 105
      ZINC: 106
      EPICHLOROHYDRIN: 107
      BISPHENOL_A: 108
      RARE_EARTH_OXIDES: 109
      AMMONIUM_CHLORIDE: 110
      ALUMINIUM: 111
      CALCIUM: 112
      SODIUM_CHROMATE: 113
      LEACHED_COFFINITE: 114
      URANYL_NITRATE: 115
      FLUORINE: 116
      SODIUM_TUNGSTATE: 117
      FERRITE: 118
      DIODE: 119
      LASER_DIODE: 120
      BALL_VALVE: 121
      ALUMINIUM_BEAM: 122
      ALUMINIUM_SHEET: 123
      ALUMINIUM_PIPE: 124
      POLYACRYLONITRILE_FABRIC: 125
      COLD_GAS_THRUSTER: 126
      COLD_GAS_TORQUE_THRUSTER: 127
      CARBON_FIBER: 128
      FOOD: 129
      SMALL_PROPELLANT_TANK: 130
      BOROSILICATE_GLASS: 131
      BALL_BEARING: 132
      LARGE_THRUST_BEARING: 133
      BORON: 134
      LITHIUM: 135
      EPOXY: 136
      NEODYMIUM_OXIDE: 137
      YTTRIA: 138
      SODIUM_DICHROMATE: 139
      NOVOLAK_PREPOLYMER_RESIN: 140
      FERROMOLYBDENUM: 141
      AMMONIUM_DIURANATE: 142
      AMMONIUM_PARATUNGSTATE: 143
      ENGINE_BELL: 144
      STEEL_TRUSS: 145
      ALUMINIUM_HULL_PLATE: 146
      ALUMINIUM_TRUSS: 147
      CARGO_MODULE: 148
      PRESSURE_VESSEL: 149
      PROPELLANT_TANK: 150
      STAINLESS_STEEL: 151
      BARE_CIRCUIT_BOARD: 152
      FERRITE_BEAD_INDUCTOR: 153
      CORE_DRILL_BIT: 154
      CORE_DRILL_THRUSTER: 155
      PARABOLIC_DISH: 156
      PHOTOVOLTAIC_PANEL: 157
      LIPO_BATTERY: 158
      NEODYMIUM_TRICHLORIDE: 159
      CHROMIA: 161
      PHOTORESIST_EPOXY: 162
      URANIUM_DIOXIDE: 163
      TUNGSTEN: 164
      SHUTTLE_HULL: 165
      LIGHT_TRANSPORT_HULL: 166
      CARGO_RING: 167
      HEAVY_TRANSPORT_HULL: 168
      TUNGSTEN_POWDER: 169
      HYDROGEN_PROPELLANT: 170
      STAINLESS_STEEL_SHEET: 171
      STAINLESS_STEEL_PIPE: 172
      CCD: 173
      COMPUTER_CHIP: 174
      CORE_DRILL: 175
      NEODYMIUM: 176
      CHROMIUM: 178
      URANIUM_TETRAFLUORIDE: 179
      PURE_NITROGEN: 180
      ND_YAG_LASER_ROD: 181
      NICHROME: 182
      NEODYMIUM_MAGNET: 183
      UNENRICHED_URANIUM_HEXAFLUORIDE: 184
      HIGHLY_ENRICHED_URANIUM_HEXAFLUORIDE: 185
      ND_YAG_LASER: 186
      THIN_FILM_RESISTOR: 187
      HIGHLY_ENRICHED_URANIUM_POWDER: 188
      LEACHED_FELDSPAR: 189
      ROASTED_RHABDITE: 190
      RHABDITE_SLAG: 191
      POTASSIUM_CARBONATE: 192
      HYDROGEN_HEPTAFLUOROTANTALATE_AND_NIOBATE: 193
      LEAD: 194
      POTASSIUM_FLUORIDE: 195
      POTASSIUM_HEPTAFLUOROTANTALATE: 196
      DIEPOXY_PREPOLYMER_RESIN: 197
      TANTALUM: 199
      PEDOT: 200
      POLYMER_TANTALUM_CAPACITOR: 201
      SURFACE_MOUNT_DEVICE_REEL: 202
      CIRCUIT_BOARD: 203
      BRUSHLESS_MOTOR_STATOR: 204
      BRUSHLESS_MOTOR_ROTOR: 205
      BRUSHLESS_MOTOR: 206
      LANDING_LEG: 207
      LANDING_AUGER: 208
      PUMP: 209
      RADIO_ANTENNA: 210
      FIBER_OPTIC_GYROSCOPE: 211
      STAR_TRACKER: 212
      COMPUTER: 213
      CONTROL_MOMENT_GYROSCOPE: 214
      ROBOTIC_ARM: 215
      BERYLLIUM_CARBONATE: 217
      BERYLLIA: 218
      BERYLLIA_CERAMIC: 219
      NEON: 220
      HEAT_EXCHANGER: 221
      TURBOPUMP: 222
      NEON_FUEL_SEPARATOR_CENTRIFUGE: 224
      FUEL_MAKE_UP_TANK: 225
      NEON_MAKE_UP_TANK: 226
      LIGHTBULB_END_MODERATORS: 227
      FUSED_QUARTZ_LIGHTBULB_TUBE: 229
      REACTOR_PLUMBING_ASSEMBLY: 230
      FLOW_DIVIDER_MODERATOR: 231
      NUCLEAR_LIGHTBULB: 232
      COMPOSITE_OVERWRAPPED_REACTOR_SHELL: 233
      CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE: 234
      HABITATION_MODULE: 235
      MOBILITY_MODULE: 236
      FLUIDS_AUTOMATION_MODULE: 237
      SOLIDS_AUTOMATION_MODULE: 238
      TERRAIN_INTERFACE_MODULE: 239
      AVIONICS_MODULE: 240
      ESCAPE_MODULE: 241
      ATTITUDE_CONTROL_MODULE: 242
      POWER_MODULE: 243
      THERMAL_MODULE: 244
      PROPULSION_MODULE: 245
    }
  }

  export type ProcessType = {
    i: number
    name: string
    processorType: number
    inputs: Record<number, number>
    outputs?: Record<number, number>
  }

  export const Process: {
    TYPES: Record<number, ProcessType>

    getType: (processId: number) => ProcessType
    getProcessingTime: (
      processId: number,
      recipes: number,
      totalBonus: number
    ) => number
    getSetupTime: (processId: number, totalBonus: number) => number
  }

  export const Processor: {
    IDS: {
      CONSTRUCTION: 0
      REFINERY: 1
      FACTORY: 2
      BIOREACTOR: 3
      SHIPYARD: 4
      DRY_DOCK: 5
    }
    STATUSES: {
      IDLE: 0
      RUNNING: 1
    }
  }

  export type BuildingType = {
    i: number
    name: string
    description: string
  }
  export const Building: {
    CONSTRUCTION_STATUSES: {
      UNPLANNED: 0
      PLANNED: 1
      UNDER_CONSTRUCTION: 2
      OPERATIONAL: 3
    }
    IDS: {
      EMPTY_LOT: 0
      WAREHOUSE: 1
      EXTRACTOR: 2
      REFINERY: 3
      BIOREACTOR: 4
      FACTORY: 5
      SHIPYARD: 6
      SPACEPORT: 7
      MARKETPLACE: 8
      HABITAT: 9
      TANK_FARM: 10
    }
    getType: (buildingId: number) => BuildingType
  }

  export const Order: {
    IDS: {
      LIMIT_BUY: 1
      LIMIT_SELL: 2
    }
    STATUSES: {
      UNINITIALIZED: 0
      OPEN: 1
      FILLED: 2
      CANCELLED: 3
    }
  }

  export type InventoryType = {
    i: number
    massConstraint: number
    volumeConstraint: number
    category: number
    productConstraints: Record<number, number>
  }
  export const Inventory: {
    IDS: {
      WAREHOUSE_SITE: 1
      EXTRACTOR_SITE: 2
      REFINERY_SITE: 3
      BIOREACTOR_SITE: 4
      FACTORY_SITE: 5
      SHIPYARD_SITE: 6
      SPACEPORT_SITE: 7
      MARKETPLACE_SITE: 8
      HABITAT_SITE: 9
      WAREHOUSE_PRIMARY: 10
      PROPELLANT_TINY: 11
      PROPELLANT_SMALL: 12
      PROPELLANT_MEDIUM: 13
      PROPELLANT_LARGE: 14
      CARGO_SMALL: 15
      CARGO_MEDIUM: 16
      CARGO_LARGE: 17
      TANK_FARM_SITE: 18
      TANK_FARM_PRIMARY: 19
    }

    STATUSES: {
      UNAVAILABLE: 0
      AVAILABLE: 1
    }
    CATEGORIES: {
      SITE: 'SITE'
      PRIMARY: 'PRIMARY'
      PROPELLANT: 'PROPELLANT'
    }
    getType: (
      type: number,
      bonuses?: { mass: number; volume: number }
    ) => InventoryType
  }

  export type ShipType = {
    i: number
    name: string
    description: string
    cargoInventoryType?: number
    cargoSlot?: number
    docking: boolean
    emergencyPropellantCap: number
    exhaustVelocity: number
    hullMass: number
    landing: boolean
    propellantSlot: number
    propellantType: number
    propellantInventoryType: number
    processType?: number
    stationType: number
  }
  export type ShipContructionType = {
    setupTime: number
    constructionTime: number
    requirements: Record<number, number>
  }
  export type ShipVariant = {
    i: number
    name: string
    shipType: number | null
    exhaustVelocityModifier: number
  }
  export const Ship: {
    IDS: {
      ESCAPE_MODULE: 1
      LIGHT_TRANSPORT: 2
      HEAVY_TRANSPORT: 3
      SHUTTLE: 4
    }
    STATUSES: {
      UNDER_CONSTRUCTION: 0
      AVAILABLE: 1
      DISABLED: 3
    }
    VARIANTS: {
      STANDARD: 1
      COBALT_PIONEER: 2
      TITANIUM_PIONEER: 3
      AUREATE_PIONEER: 4
    }
    TYPES: Record<number, ShipType>
    getConstructionType: (shipType: number) => ShipContructionType
    getType: (shipType: number) => ShipType
    getVariant: (variant: number) => ShipVariant
  }

  export type AssetMetadata = {
    iconVersion: number
    modalVersion: number
  }
  export const Assets: {
    Building: Record<number, AssetMetadata>
    Product: Record<number, AssetMetadata>
    Ship: Record<number, AssetMetadata>
  }

  export const Address: {
    toStandard: (
      address: string,
      explicitChain?: 'ethereum' | 'starknet'
    ) => string
    areEqual: (
      address1: string,
      address2: string,
      chain1?: string,
      chain2?: string
    ) => boolean
    getChain: (address: string) => 'ethereum' | 'starknet'
  }

  export type StationObject = {
    stationType: number
    population: number
  }
  export type AbilityBonusMatch = {
    matches: number
    bonusPerMatch: number
    bonus: number
  }
  export type AbilityBonusDetails = {
    name: string
    crewmatesMultiplier: number
    stationMultiplier?: number
    foodMultiplier?: number
    totalBonus: number
    traits: Record<string, AbilityBonusMatch>
    titles: Record<string, AbilityBonusMatch>
    class: {
      classId: number
      matches: number
      multiplier: number
    }
  }
  export const Crew: {
    CREWMATE_STACKING_BONUS_EFFICIENCY: number[]
    CREWMATE_FOOD_PER_YEAR: number
    STARVING_MULTIPLIER: number
    getAbilityBonus: (
      abilityId: number,
      crewmates: (InfluenceEntity | NonNullable<InfluenceEntity['Crewmate']>)[],
      station: NonNullable<InfluenceEntity['Station']>,
      timeSinceFed: number
    ) => AbilityBonusDetails
    getCurrentFoodRatio: (timeSinceFed?: number, consumption?: number) => number
    getFoodMultiplier: (
      timeSinceFed?: number,
      consumption?: number,
      rationing?: number
    ) => number
    getAbilityBonusFromFood: (
      timeSinceFed: number,
      crewmates: (InfluenceEntity | NonNullable<InfluenceEntity['Crewmate']>)[]
    ) => AbilityBonusDetails
  }

  export const Crewmate: {
    ABILITY_IDS: {
      CORE_SAMPLE_TIME: 1
      CORE_SAMPLE_QUALITY: 2
      HOPPER_TRANSPORT_TIME: 3
      EXTRACTION_TIME: 4
      CONSTRUCTION_TIME: 5
      INVENTORY_MASS_CAPACITY: 6
      PROPELLANT_EXHAUST_VELOCITY: 7
      REFINING_TIME: 8
      MANUFACTURING_TIME: 9
      REACTION_TIME: 10
      FREE_TRANSPORT_DISTANCE: 11
      DECONSTRUCTION_YIELD: 12
      SECONDARY_REFINING_YIELD: 13
      FOOD_CONSUMPTION_TIME: 14
      FOOD_RATIONING_PENALTY: 15
      MARKETPLACE_FEE_ENFORCEMENT: 16
      MARKETPLACE_FEE_REDUCTION: 17
      PROPELLANT_FLOW_RATE: 18
      INVENTORY_VOLUME_CAPACITY: 19
      SHIP_INTEGRATION_TIME: 20
    }
  }

  export type StationType = {
    i: number
    cap: number
    recruitment: boolean
    efficiency: number
  }
  export const Station: {
    IDS: {
      STANDARD_QUARTERS: 1
      EXPANDED_QUARTERS: 2
      HABITAT: 3
    }
    TYPES: Record<number, StationType>
    getEfficiency: (stationType: number, population: number) => number
    getType: (stationType: number) => StationType
  }

  export type PermissionType = {
    name: string
    isApplicable: (entity: unknown) => boolean
    isExclusive?: boolean
  }
  export type PolicyType = {
    name: string
    description: string
    policyKey: string | null
    agreementKey: string | null
    additionSystemSystem: string | null
    removalSystem: string | null
  }
  export const Permission: {
    IDS: {
      USE_LOT: 1
      RUN_PROCESS: 2
      ADD_PRODUCTS: 3
      REMOVE_PRODUCTS: 4
      STATION_CREW: 5
      RECRUIT_CREWMATE: 6
      DOCK_SHIP: 7
      BUY: 8
      SELL: 9
      LIMIT_BUY: 10
      LIMIT_SELL: 11
      EXTRACT_RESOURCES: 12
      ASSEMBLE_SHIP: 13
    }
    POLICY_IDS: {
      PRIVATE: 1
      PUBLIC: 2
      PREPAID: 3
      CONTRACT: 4
    }
    getPrepaidPolicyRate: (entity: InfluenceEntity) => number
  }

  type Call = {
    contractAddress: string
    entrypoint: string
    calldata: any
  }
  export const System: {
    getRunSystemCall: (
      name: string,
      input: Record<string, unknown>,
      dispatcherAddress: string,
      limitToVars = false
    ) => Call
    getTransferWithConfirmationCall: (
      recipient: string,
      amount: bigint,
      memo: unknown[],
      consumerAddress: string,
      swayAddress: string
    ) => Call
  }

  export const Deposit: {
    STATUSES: {
      UNDISCOVERED: 0
      SAMPLING: 1
      SAMPLED: 2
      USED: 3
    }
    /* maximum amount that can be extracted in grams */
    MAX_YIELD: number
    /** in-game time in seconds */
    CORE_SAMPLING_TIME: number
  }
}
