
let Warn = (props) => {
    return (
        <>
            {
                <div className="game-tip game-warn flex w100 flex-center cf fz-14">
                    <img className="info-icon" src={require('../../../assets/images/user/info.svg').default} alt="" />
                    {
                        props.title
                    }
                </div>

            }
        </>

    )
}


export default Warn