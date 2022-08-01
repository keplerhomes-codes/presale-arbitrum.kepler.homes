import './Nft.scss'
export default function (props) {
    return (
        <a className='nft m-t-40 pointer m-r-20 tangle-border' href={"/Mysterybox/"+props.tokenId}>
            <div className="cover">
                <img src={require('../../assets/images/nft/cover.png')} alt="" />
            </div>
            <div className="name cf fz-18 fwb m-t-30">Kepler MysteryBox</div>
            <div className="flex">
                <span className="fz-14 c56">#{props.tokenId}</span>
            </div>
            
            <div className="str top"></div>
            <div className="str right"></div>
            <div className="str left"></div>
            <div className="str bottom"></div>

        </a>
    )
}