/* ============ CONFIG ============= */
const NFT_ADDRESS = "0xBFdD9B4082BFaa9203fDda96aaF6420ef70772f2";          // <-- change
const NFT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function tokenURI(uint256) view returns (string)"
];

/* ============ Main ============= */
window.onload = async ()=>{
  if(!window.ethereum){ alert("Install MetaMask"); return; }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  const signer = provider.getSigner();
  const me     = await signer.getAddress();
  const nft    = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

  const wrap = document.getElementById("collectibles-content");
  wrap.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading…</p></div>';

  try{
    const total = (await nft.balanceOf(me)).toNumber();
    if(!total){ wrap.innerHTML="<p>No collectibles yet.</p>"; return; }

    const grid=document.createElement("div");
    grid.className="collectibles-grid";
    grid.style.cssText="display:flex;flex-wrap:wrap;gap:20px;padding:20px;";

    let found=0,id=0;
    while(found<total && id<1000){
      try{
        if((await nft.ownerOf(id)).toLowerCase()===me.toLowerCase()){
          const uri  = await nft.tokenURI(id);
          const meta = await (await fetch(uri.replace("ipfs://","https://gateway.pinata.cloud/ipfs/"))).json();
          const card = document.createElement("div");
          card.className="collectible-card";
          card.style.cssText="border:1px solid #333;border-radius:8px;padding:10px;width:200px;text-align:center;background:#1a1a1a;";
          card.innerHTML=`<img src="${meta.image.replace("ipfs://","https://gateway.pinata.cloud/ipfs/")}" style="width:100%;border-radius:8px"><h3 style="margin-top:10px;">${meta.name}</h3><p style="font-size:.8em;color:#888;">ID #${id}</p>`;
          grid.appendChild(card);
          found++;
        }
      }catch{}
      id++;
    }
    wrap.innerHTML=""; wrap.appendChild(grid);
  }catch(e){ console.error(e); wrap.innerHTML="<p>Failed to load NFTs.</p>"; }
};
