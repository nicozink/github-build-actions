import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void>
{
	try
	{
		const type: string = core.getInput('type');

		await exec.exec("git", ["submodule", "update", "--init"]);

		if (process.platform.toString() === "linux")
		{
			if (type.toString() === "native")
			{
				await exec.exec("cmake", ["."]);
				await exec.exec("make");
				await exec.exec("./unittest_test");
			}
			else
			{
				await exec.exec("emconfigure", ["cmake", "."]);
				await exec.exec("make");
				await exec.exec("node", ["unittest_test.js"]);
			}
		}
		else if (process.platform.toString() === "win32")
		{
			await exec.exec("cmake", ["."]);
			await exec.exec("msbuild unittest.sln");
			await exec.exec("Debug\\unittest_test.exe");
		}
	}
	catch (error)
	{
		core.setFailed(error.message);
	}
}

run()
