
export type LoginResponse ={
                tokenType: "Bearer";
                accessToken: string;
            }

    export type LoginPayload={
        email:string;
        password: string;
    }