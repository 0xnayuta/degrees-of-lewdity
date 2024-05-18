/**
 * @type {CanvasModelOptions}
 */
const combatCloseVagina = {
	name: "combatCloseVagina",
	width: 256,
	height: 256,
	frames: 4,
	generatedOptions() {
		console.log(this.name, "generatedOptions");
		return [];
	},
	defaultOptions() {
		console.log(this.name, "defaultOptions");
		return {};
	},
	preprocess(options) {
		if (!["horse", "beast-oral", "machine"].includes(options.vaginaNpc) && (options.vagina === "penetrated" || V.vaginause === "othervagina")) {
			options.vaginaSilhouette = V.vaginause === "othervagina" ? "trib" : V.vaginastate === "doublepenetrated" ? "dp" : "solo";
		} else {
			options.vaginaSilhouette = null;
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
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			filters: ["body"],
			z: 51,
		},
		vagina_aroused: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vagina}-aroused.png`;
			},
			showfn(options) {
				return !!options.showVagina && options.vagina === "entrance" && V.vaginaWetness >= 75;
			},
			animationfn(options) {
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: 51,
		},
		penis: {
			srcfn(options) {
				const penetrated = V.position === "missionary" && options.vagina === "penetrated";
				return `${options.src}vagina/${options.position}/herm-${options.herm}${penetrated ? "-penetrated" : ""}.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.player.penisExist && V.worn.genitals.name !== "chastity parasite";
			},
			animationfn(options) {
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			filters: ["body"],
			z: 51,
		},
		vagina_cum: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/cum.png`;
			},
			showfn(options) {
				return !!options.showVagina && setup.bodyliquid.combined("vagina") >= 1;
			},
			animationfn(options) {
				return "sex-17f-slow";
			},
			filters: ["body"],
			z: 51,
		},
		pubic_strip: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/hair/${options.vagina}-pbstrip${V.pbstrip}.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.pbdisable === "f" && V.pbstrip >= 1;
			},
			animationfn(options) {
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: 51,
		},
		pubic_hair: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/hair/${options.vagina}-pb${V.pblevel}.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.pbdisable === "f" && V.pblevel >= 2;
			},
			animationfn(options) {
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: 51,
		},
		hirsute: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/hair/hirsute.png`;
			},
			showfn(options) {
				return (
					!!options.showVagina &&
					(!["hidden", "disabled"].includes(V.transformationParts.wolf.pubes) || !["hidden", "disabled"].includes(V.transformationParts.bird.pubes))
				);
			},
			animationfn(options) {
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			filters: ["pbhair"],
			z: 51,
		},
		npc_penetrator: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc}-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: 51,
		},
		npc2_penetrator: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc2}-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc2;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["body"],
			z: 51,
		},
		npc_condom: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc}-condom-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc && !!options.vaginaNpcCondom;
			},
			alphafn(options) {
				return 0.4;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["npc_condom"],
			z: 51,
		},
		npc2_condom: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/${options.vaginaNpc2}-condom-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc2 && !!options.vaginaNpc2Condom;
			},
			alphafn(options) {
				return 0.4;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["dp_condom"],
			z: 51,
		},
		silhouette: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/npc/shadow-${options.vaginaSilhouette}.png`;
			},
			showfn(options) {
				return !!options.showVagina && options.vaginaSilhouette;
			},
			animationfn(options) {
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			z: 51,
		},
		parasite: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/parasite${V.earSlime.focus === "impregnation" ? "shorts" : "panties"}.png`;
			},
			showfn(options) {
				return !!options.showVagina && (V.parasite.clit.name === "parasite" || V.parasite.penis.name === "parasite");
			},
			animationfn(options) {
				return options.vaginaNpc ? options.animKeyVagina : "sex-1f-idle";
			},
			z: 51,
		},
		panties: {
			srcfn(options) {
				return `${options.src}vagina/${options.position}/panties.png`;
			},
			showfn(options) {
				return !!options.showVagina && V.worn.under_lower.state === "totheside";
			},
			animationfn(options) {
				return options.vaginaNpc ? options.animKeyVagina : "sex-1f-idle";
			},
			z: 51,
		},
		chastity: {
			/* KirstyTODO */
			srcfn(options) {
				return `${options.src}worn/${options.position}/hirsute.png`;
			},
			showfn(options) {
				return !!options.showVagina && playerChastity("vagina");
			},
			animationfn(options) {
				return !options.vaginaNpc ? "sex-1f-idle" : options.animKeyVagina;
			},
			z: 51,
		},
		/* npc_cum: {KirstyTODO
			srcfn(options) {
				return `${options.src}vagina/${options.position}/${options.vaginaNpc}-condom-${options.vagina}.png`;
			},
			showfn(options) {
				return !!options.showVagina && !!options.vaginaNpc;
			},
			alphafn(options) {
				return 0.4;
			},
			animationfn(options) {
				return options.animKeyVagina;
			},
			filters: ["npc_condom"],
			z: 51,
		}, */
	},
};
Renderer.CanvasModels.combatCloseVagina = combatCloseVagina;
