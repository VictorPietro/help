import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function create() {
    // o proccess.env.IPV4_DB não funciona aqui
    const connection = await createConnection(`172.29.1.1`);

    const ids = {
        petr: uuidV4(),
        vale: uuidV4(),
        itsa: uuidV4()
    }

    await connection.query(
        `
            INSERT INTO ASSETS (id, name, ticker, latest_price)
            VALUES
                ('${ids.petr}', 'Petrobrás', 'PETR4', 30),
                ('${ids.vale}', 'Vale', 'VALE3', 50),
                ('${ids.itsa}', 'Itausa', 'ITSA4', 10);
        `
    );

    await connection.close();
}

create().then(() => console.log("Assets have been created!"));
