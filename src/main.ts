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
	}
	catch (error)
	{
		core.setFailed(error.message);
	}
}

run()
