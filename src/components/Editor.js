const Editor = ()=> {
    return (
        <div
        style={{
            minHeight: '100vh',
            minWidth: '100vw',
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center',
            margin: '0 2rem'
        }}
        >
        
            {/* <h2>Editor</h2>  */}
            <div
            style={{
                // backgroundColor: 'red',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                rowGap: '2rem',
                height: '250px',
                textAlign:'center'
            }}
            >
                <p className="amount">1000</p>
                <p className="amount">800</p>
                <p className="amount">600</p>
                <p className="amount">400</p>
                <p className="amount">200</p>
                <p className="amount">0</p>
            </div>
<section>


            <div
            style={{
                display:'flex',
                width: '650px',
                height: '300px',
                columnGap: '3rem',
                borderLeft: '4px solid brown',
                borderBottom: '4px solid brown',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                // margin: '0 0 0 2rem'
                    // overflowX: 'auto'
                // backgroundColor: 'blue'

            }}
            >
                <article
                id="bar-container"
                style={{display:'flex',
                    flexDirection:'row',
                    columnGap: '3rem',
                    width: '590PX',
                    alignItems: 'flex-start',
                    margin: '0 0 0 2rem',
                
                    // backgroundColor: "yellow"
                    // height: '600px'
                }}
                >
                    <p className="bars"></p>
                    <p className="bars"></p>
                    <p className="bars"></p>
                    <p className="bars"></p>
                    <p className="bars"></p>
                    <p className="bars"></p>
                </article>
            </div >
            <div
            style={{
                display: 'flex',
                // width: '600px',
                columnGap: '4rem',
                margin: '0 0 0 2.6rem'
                // alignItems: 'flex-start',
                // backgroundColor: 'blue'
            }}
            >
                <p>Jan</p>
                <p>Feb</p>
                <p>Mar</p>
                <p>Apr</p>
                <p>May</p>
                <p>Jun</p>
            </div>
            </section>
        </div>
    )
}
export default Editor