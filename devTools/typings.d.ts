/*
 * This is a TypeScript typings file with definitions an documentation of in-game structures.
 *
 * While documenting everything  here is optional, the definitions might be picked by IDE,
 * and, should TypeScript rewrite become a thing in future, would work as a static type check.
 */

/* Declare commonly used aliases or functions */
declare var V: any;
declare var T: any;
declare var random: any;

// Add our extensions
interface ObjectConstructor {
    hasOwn(object: any, property: any): boolean;
    deepMerge(objects: any): object;
    find(objects: any): object;
}
interface NumberConstructor {
    shuffle();
	select(index: number): any;
	except(): any;
	formatList(options: any): any;
}
interface ArrayConstructor {
    between(min: number, max: number): boolean;
}
