interface ISocketProvider {
    execute(get_assets?: boolean, get_options?: boolean): Promise<any[]>;
}

export { ISocketProvider };
