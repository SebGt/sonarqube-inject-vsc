import { IConfigTemplate } from "./IConfigTemplate";

export default class SonarlintTemplate implements IConfigTemplate {

    public getTemplateObject(): object {
        return {
            $schema: "https://raw.githubusercontent.com/silverbulleters/sonarqube-inject-vsc/master/schemas/sonarlint.json",
            serverId: "my-company-server",
            projectKey: "my-project",
        };
    }
}
