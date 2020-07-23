@echo OFF

:START
echo ========================================
echo         Express Server Templates
echo ========================================
echo.
echo This file will streamline the building process for
echo server templates.
echo.
echo Please note that you'll need 7zip and git on your
echo path for this batch file to work.
echo.

:CHANGES
echo Here's the current repository status:
echo.
git status
echo.
echo Make sure that:
echo  * All changes have been committed.
echo  * The current directory is up-to-date with the remote.
echo  * The upstream has been set properly.
echo.
echo What do we do next?
echo  * [d]rop into the command prompt (to fix issues).
echo  * [c]ancel the build process.
echo  * [p]roceed to the next step.

:CHANGES_NEXT_STEP
set /p CHANGES_NEXT="What now? [d/c/p]: "

if %CHANGES_NEXT%==d goto CHANGES_DROP
if %CHANGES_NEXT%==D goto CHANGES_DROP

if %CHANGES_NEXT%==c goto EXIT
if %CHANGES_NEXT%==C goto EXIT

if %CHANGES_NEXT%==p goto TAG
if %CHANGES_NEXT%==P goto TAG

echo Bad input. Try again.
echo.
goto CHANGES_NEXT_STEP

:CHANGES_DROP
echo Dropping to the command prompt... (run "exit" when you're done)
cmd /K "echo."
goto CHANGES_NEXT_STEP

:TAG
echo This version should be tagged as? (type nothing to skip git tagging)
set /p EST_VERSION="(x.x.x): "

if [%EST_VERSION%]==[] goto ZIP_VERSION

echo.
git tag v%EST_VERSION%
echo.

goto ZIP

:ZIP_VERSION
echo What should be the version for the built files?
set /p EST_VERSION="(x.x.x): "

:ZIP
echo Clearing out the unnecessary files...

mkdir build > NUL 2>&1
move bare/node_modules build/bare_node_modules > NUL 2>&1
move modular/node_modules build/modular_node_modules > NUL 2>&1
move bare/logs build/bare_logs > NUL 2>&1
move modular/logs build/modular_logs > NUL 2>&1

echo Zipping...

echo.
cd bare
7z a -tzip "../build/express-server-templates--bare-%EST_VERSION%.zip" * > NUL 2>&1
cd ../modular
7z a -tzip "../build/express-server-templates--modular-%EST_VERSION%.zip" * > NUL 2>&1
cd ..
echo.

echo Zipping complete. Restoring files...

mkdir build > NUL 2>&1
move build/bare_node_modules bare/node_modules > NUL 2>&1
move build/modular_node_modules modular/node_modules > NUL 2>&1
move build/bare_logs bare/logs > NUL 2>&1
move build/modular_logs modular/logs > NUL 2>&1

echo Opening output folder...
cd build
start .

echo All done. 
pause

:EXIT
echo Exiting...