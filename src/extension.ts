// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

import LintProvider from "./features/lintProvider";
import GlobalTemplate from "./templates/globalTemplate";
import { IConfigTemplate } from "./templates/IConfigTemplate";
import SonarlintTemplate from "./templates/sonarlintTemplate";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    addSubscriptions(context);
}

function addSubscriptions(context: vscode.ExtensionContext) {
    const linter = new LintProvider();
    linter.activate(context.subscriptions);

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.analyzeProject", () => {
        linter.doLint();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.analyzeCurrentFile", () => {
        linter.doLint(vscode.window.activeTextEditor.document);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.updateBindings", () => {
        linter.updateBindings();
        linter.doLint(vscode.window.activeTextEditor.document);
    }));

    context.subscriptions.push(
        vscode.commands.registerCommand("sonarqube-inject.createGlobalJson", createGlobalJson),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("sonarqube-inject.createSonarlintJson", createSonarlintJson),
    );
}

async function createGlobalJson() {
    const rootPath = path.join(os.homedir(), ".sonarlint");

    if (!rootPath) {
        console.error("Can't determitate homedir");
        vscode.window.showErrorMessage("Can't determitate homedir.");
        return;
    }

    try {
        await fs.stat(rootPath);
    } catch (error) {
        try {
            await fs.mkdir(rootPath);
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
    }

    const confPath = path.join(rootPath, "conf");
    try {
        await fs.stat(confPath);
    } catch (error) {
        try {
            await fs.mkdir(confPath);
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
    }

    const filename = "global.json";

    createConfigFile(confPath, filename, new GlobalTemplate());
}

async function createSonarlintJson() {
    const rootPath = vscode.workspace.rootPath;
    const filename = "sonarlint.json";

    createConfigFile(rootPath, filename, new SonarlintTemplate());
}

async function createConfigFile(rootPath: string, filename: string, template: IConfigTemplate) {
    if (!rootPath) {
        return;
    }
    const filePath = path.join(rootPath, filename);
    const action = "Open " + filename;
    let selectedAction: string;

    try {
        await fs.stat(filePath);
        selectedAction = await vscode.window.showInformationMessage(filename + " already exists", action);
    } catch (error) {
        try {
            await fs.writeFile(filePath, JSON.stringify(template.getTemplateObject(), undefined, 4));
            selectedAction = await vscode.window.showInformationMessage(filename + " was created", action);
        } catch (error) {
            vscode.window.showErrorMessage(error);
        }
    }

    if (selectedAction) {
        const textDocument = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(textDocument);
    }
}
