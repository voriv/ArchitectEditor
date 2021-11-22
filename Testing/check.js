//const {Builder, By, Key, until} = require('selenium-webdriver');
const  { check_load_toolbar } = require( './toolbox/toolbox.spec.js' );

check_load_toolbar();


/*
async function check_load_menu()
{
  console.log( process.cwd().replace(new RegExp("\\\\", "g"), '/') );
  const file_path = `${process.cwd().replace("\\",'/')}/ArchitectEditor/Editor/editor.html`;
  console.log( file_path)
}

async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get('file://I:/gitlab/ArchitectEditor/ArchitectEditor/Editor/editor.html');
      //var test =  driver.find_element_by_name('class2')
      var ee = await driver.findElement(By.name('class'));
      await ee.getAttribute( "outerHTML").then(
         hh => console.log( hh));
        //console.log( a.outerHTML )});
      //await driver.wait(until.titleIs('webdriver - Поиск в Google'), 5000);
    } catch ( errr )
    {
      console.log( errr.message + errr.stack );
    }finally {
      await driver.quit();
    }
  };

  check_load_menu();

  */