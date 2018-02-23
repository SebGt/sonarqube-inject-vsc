import { IConfigTemplate } from "./IConfigTemplate";

export default class GlobalTemplate implements IConfigTemplate {
    public getTemplateObject(): object {
        return {
            $schema: "https://raw.githubusercontent.com/silverbulleters/sonarqube-inject-vsc/master/schemas/global.json",
            servers: [
                {
                    id: "localhost",
                    url: "http://localhost:9000",
                    token: "YOUR_SONARQUBE_AUTH_TOKEN",
                },
                {
                    id: "my-company-server",
                    url: "http://my-company.com",
                    token: "YOUR_SONARQUBE_AUTH_TOKEN",
                },
            ],
        };
    }
}
