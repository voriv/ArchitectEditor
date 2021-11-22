const {Builder, By, Key, until} = require('selenium-webdriver');


function select_class()
{

}
async function add_class_test()
{
    //load page
    let driver = await new Builder().forBrowser('chrome').build();
    try{
        driver.get('http://127.0.0.1:5500/ArchitectEditor/Testing/add_elements/add_class.html');

        await driver.manage().window().setRect( { width: 1024, height: 768 } );
        let toolbox = await driver.findElement( By.id( 'toolbox' ));
        await driver.sleep( 2000 )
        let actions = driver.actions();
        await actions.move({ origin : toolbox, x : 10, y: 20});
        await driver.sleep( 2000 )
        actions.click();

        //select and click class item in toolbox



    }catch( exc )
    {
        console.log( exc.message + exc.stack );
    } finally{
        driver.close();
    }

    
    //move cursor
    //add class to diagram
}

module.exports = { add_class_test }

add_class_test();