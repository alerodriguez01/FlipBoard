class TokenInvalido extends Error{
    constructor(){
        super('Token invalido');
        this.name = 'TokenInvalido';
    }
}

export { TokenInvalido }