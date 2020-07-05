import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void>
{
	try
	{
		const type: string = core.getInput('type');
		const github_token: string = core.getInput('github_token');
		const verbose: string = core.getInput("verbose") || "false";

		await exec.exec("git", ["clone", "https://github.com/nicozink/build_tools", "libraries/build_tools"]);

		var build_command = new Array<string>();
		build_command.push("libraries/build_tools/build_script/configure.py");
		build_command.push("--platform");
		build_command.push(type.toString());
		build_command.push("--github_token");
		build_command.push(github_token.toString());
		build_command.push(".");

		if (verbose == "true")
		{
			build_command.push("--verbose");
		}

		await exec.exec("python", build_command);
	}
	catch (error)
	{
		core.setFailed(error.message);
	}
}

run()
