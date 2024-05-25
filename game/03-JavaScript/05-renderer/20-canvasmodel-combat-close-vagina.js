/**
 * @type {CanvasModelOptions}
 */
const combatCloseVagina = {
	name: "combatCloseVagina",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "closeVagina generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "closeVagina defaultOptions");
		return {
			root: "img/newsex/close/",
			position: "missionary",
			showVagina: false,
			penis: {},
			filters: {
				worn: {},
			},
		};
	},
	preprocess(options) {
		console.log(this.name, "closeVagina preprocess");
		options.hirsute =
			!["hidden", "disabled"].includes(V.transformationParts.wolf.pubes) || !["hidden", "disabled"].includes(V.transformationParts.bird.pubes);
		if (options.vaginaNpc) {
			if (!["horse", "beast-oral", "machine"].includes(options.vaginaNpc) && (options.vagina === "penetrated" || V.vaginause === "othervagina")) {
				options.vaginaSilhouette = V.vaginause === "othervagina" ? "trib" : V.vaginastate === "doublepenetrated" ? "dp" : "solo";
			} else options.vaginaSilhouette = null;
		}
	},
	/** @type {Object<string, CanvasModelLayerClose>} */
	layers: {
		vagina: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vagina}-base.png`;
			},
			showfn(options) {
				return !!options.showVagina;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		vaginaAroused: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vagina}-aroused.png`;
			},
			showfn(options) {
				return !!options.showVagina && options.vagina === "entrance" && V.vaginaWetness >= 75;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: ZIndices.closeBase,
		},
		penis: {
			srcfn(options) {
				if (V.position === "missionary" && options.vagina === "penetrated" && V.player.ballsExist) {
					options.pcPenis = options.penis.size + "-" + options.penis.type + "-penetrated";
				} else {
					options.pcPenis = options.penis.size + "-" + options.penis.type;
				}
				return `${options.src}vagina/${options.position}/${options.pcPenis}.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.player.penisExist && V.worn.genitals.name !== "chastity parasite";
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: ZIndices.closeGenitals + 2,
		},
		vaginaCum: {
			srcfn(options) {
				options.cumState =
					options.vagina === "penetrated" ? "penetrated" : ["entrance", "doubleentrance"].includes(V.vaginastate) ? "entrance" : "vagina";
				return `${options.src}vagina/${options.position}/${options.cumState}-cum.png`;
			},
			showfn(options) {
				return !!options.showVagina && setup.bodyliquid.combined("vagina") >= 1;
			},
			animationfn(options) {
				return options.cumState === "vagina" ? "sex-17f-slow" : options.animKeyVagina;
			},
			z: ZIndices.closeCum,
		},
		pubicStrip: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/hair/${options.vagina}-pbstrip${V.pbstrip}.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.pbdisable === "f" && V.pbstrip >= 1;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: ZIndices.closeBase,
		},
		pubicHair: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/hair/${options.vagina}-pb${V.pblevel}.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.pbdisable === "f" && V.pblevel >= 2;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: ZIndices.closeBase,
		},
		hirsute: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/hair/hirsute.png`;
			},
			showfn(options) {
				return !!options.showVagina && options.hirsute;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: ZIndices.closeBase,
		},
		npcPenetrator: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc}-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["npcBody"],
			z: ZIndices.closeNpc,
		},
		npc2Penetrator: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc2}-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc2;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["npcBody"],
			z: ZIndices.closeNpc,
		},
		npcCondom: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc}-condom-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc && !!V.NPCList[V.vaginatarget].condom.worn;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			alpha: 0.4,
			filters: ["npcVaginaCondomColour"],
			z: ZIndices.closeNpc + 1,
		},
		npc2Condom: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc2}-condom-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc2 && !!V.NPCList[V.vaginadoubletarget].condom.worn;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			alpha: 0.4,
			filters: ["npcVaginaCondom2"],
			z: ZIndices.closeNpc + 1,
		},
		silhouette: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/shadow-${options.vaginaSilhouette}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaSilhouette;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			z: ZIndices.closeNpc + 3,
		},
		parasite: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/parasite-${V.earSlime.focus === "impregnation" ? "shorts" : "panties"}.png`;
			},
			showfn(options) {
				return !!options.showVagina && (V.parasite.clit.name === "parasite" || V.parasite.penis.name === "parasite");
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["parasitePanties"],
			z: ZIndices.closeWorn,
		},
		panties: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/panties.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.worn.under_lower.state === "totheside";
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filtersfn(options) {
				return ["worn_under_lower_main"];
			},
			z: ZIndices.closeWorn,
		},
		chastity: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.chastityDevice}.png`;
			},
			showfn(options) {
				return !!options.showVagina && playerChastity();
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filtersfn(options) {
				if (options.chastityDevice.includes("parasite")) {
					return ["parasitePanties"];
				} else {
					return null;
				}
			},
			z: ZIndices.closeWorn,
		},
		npcCum: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/npc-cum.png`;
			},
			showfn(options) {
				return (
					!!options.showVagina &&
					!!options.vaginaNpc &&
					V.enemyarousal >= V.enemyarousalmax &&
					wearingCondom(V.vaginatarget) !== "worn" &&
					!npcHasStrapon(V.vaginatarget)
				);
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			z: ZIndices.closeNpc,
		},
	},
};
Renderer.CanvasModels.combatCloseVagina = combatCloseVagina;
