export declare class ImmutableUtils {
    static setProperty(instance: any, path: string, newValue: any): any;
    static getProperty(instance: any, path: string): any;
    static change<T>(instance: T, propertyName: string, newValue: any): T;
    static addInArray<T>(instance: T, propertyName: string, newItem: any, index?: number): T;
}
