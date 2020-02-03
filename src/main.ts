import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void>
{
	try
	{
		const type: string = core.getInput('type');

		await exec.exec("git", ["submodule", "update", "--init"]);

		if (type.toString() === "native")
		{
			await exec.exec("cmake", ["."]);
			
		}
		else
		{
			await exec.exec("emconfigure", ["cmake", "."]);
		}

		await exec.exec("cmake --build . --config Release");
		await exec.exec("ctest -VV -C Release");
	}
	catch (error)
	{
		core.setFailed(error.message);
	}
}

run()
