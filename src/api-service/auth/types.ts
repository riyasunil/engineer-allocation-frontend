
export type LoginResponse ={
                tokenType: "Bearer";
                accessToken: string;
                user_id : string,
                role: string
            }

    export type LoginPayload={
        email:string;
        password: string;
    }