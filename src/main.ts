import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void>
{
	try
	{
		const project_root: string = core.getInput('project_root');
		const type: string = core.getInput('type');
		const github_token: string = core.getInput('github_token');
		const verbose: string = core.getInput("verbose") || "false";

		var config_command = new Array<string>();
		config_command.push("-B");
		config_command.push("build");
		config_command.push("-S");
		config_command.push(project_root);
		config_command.push("-DGITHUB_TOKEN=" + github_token.toString());

		await exec.exec("cmake", config_command);

		var restore_command = new Array<string>();
		restore_command.push("restore");
		restore_command.push("build/" + project_root + ".sln");

		await exec.exec("dotnet", restore_command);

		var build_command = new Array<string>();
		build_command.push("--build");
		build_command.push("build");
		build_command.push("--config");
		build_command.push("Release");

		await exec.exec("cmake", build_command);

		var test_command = new Array<string>();
		test_command.push("--test-dir");
		test_command.push("build");
		test_command.push("-VV");
		test_command.push("-C");
		test_command.push("Release");

		await exec.exec("ctest", test_command);

	}
	catch (error: unknown)
	{
		if (error instanceof Error)
		{
			core.setFailed(error.message);
		}
	}
}

run()
