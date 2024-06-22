declare module "twine-sugarcube" {
	export interface SugarCubeTemporaryVariables {
		multiCombatModels: {
			[x: string]: MultiCanvasModel;
		}
	}
}

declare global {
	interface Window {
		CombatRenderer?: typeof CombatRenderer;
		PlayerCombatMapper?: typeof PlayerCombatMapper;
		CanvasHelper?: typeof CanvasHelper;
		canvasHelper?: CanvasHelper;
		CombatEditor?: typeof CombatEditor;
	}

	interface CanvasModelLayers<T extends Options> {
		show?: boolean;
		showfn?(options: T): boolean;
		src?: string;
		srcfn?(options: T): string;
		z?: number;
		zfn?(options: T): number;
		alpha?: number;
		alphafn?(options: T): number;
		desaturate?: boolean;
		desaturatefn?(options: T): boolean;
		brightness?: number;
		brightnessfn?(options: T): number;
		contrast?: number;
		contrastfn?(options: T): number;
		blendMode?: string;
		blendModefn?(options: T): string;
		blend?: string;
		blendfn?(options: T): string;
		masksrc?: string;
		masksrcfn?(options: T): string;
		animation?: string;
		animationfn?(options: T): string;
		frames?: number;
		framesfn?(options: T): number;
		filters?: string[];
		filtersfn?(options: T): string[];
		dx?: number;
		dxfn?(options: T): number;
		dy?: number;
		dyfn?(options: T): number;
		width?: number;
		widthfn?(options: T): number;
		height?: number;
		heightfn?(options: T): number;
	}

	interface CanvasModelOptions<T extends Options> {
		name: string;
		width: number;
		height: number;
		frames: number;
		metadata: object;
		layers: {
			[x: string]: CanvasModelLayers<T>;
		}
		generatedOptions(): string[];
		defaultOptions(): T;
		preprocess(options: T): void;
	}

	interface CanvasModel<T extends Options> {
		defaultOptions(): T;
		createCanvas(cssAnimated: boolean): CanvasRenderingContext2D;
		reset(): void;
		showLayer(name: string, filters: object): void;
		hideLayer(name: string): void;
		render(canvas: CanvasRenderingContext2D, options: T, listener: CanvasListener): void;
		animate(canvas: CanvasRenderingContext2D, options: T, listener: CanvasListener): AnimatingCanvas;
		redraw(): void | Renderer.AnimatingCanvas;
		preprocess(options: T): void;
		compile(options: T): CompositeLayerSpec[];
	}
}

export { };
