import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function create() {
    // o proccess.env.IPV4_DB não funciona aqui
    const connection = await createConnection(`172.29.1.1`);

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
        `
            INSERT INTO USERS(id, username, name, email, password, "isAdmin", bio)
            VALUES('${id}', 'admin', 'Ademir', 'admin@merlin.com.br', '${password}', true, 'Meu Perfil')
        `
    );

    await connection.close();
}

create().then(() => console.log("User admin has been created!"));
