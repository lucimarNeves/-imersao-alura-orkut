import { request } from "http"
import { SiteClient } from 'datocms-client';

export default async function recebedoDeRequests(request, response) {

    if (request.method === 'POST') {
        const TOKEN = '107bbb97b1e20143cbaab41dc623fe';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "972355",
            ...request.body,
        })

        response.json({
            dados: 'Jogo em algum lugar qualquer',
            registroCriado: registroCriado,
        })
        return;
    }

    response.status(404).json({
        message: "Ainda não temos nada no GET, mas o POST tem"
    })
}