import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void>
{
	try
	{
		const type: string = core.getInput('type');
		const github_token: string = core.getInput('github_token');

		await exec.exec("git", ["clone", "https://github.com/nicozink/build_tools", "libraries/build_tools"]);

		await exec.exec("python", ["libraries/build_tools/build_script/configure.py", "--platform", type.toString(), "--github_token", github_token.toString(), "."]);

		await exec.exec("cmake --build . --config Release");
		await exec.exec("ctest -VV -C Release");
	}
	catch (error)
	{
		core.setFailed(error.message);
	}
}

run()
