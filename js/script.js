/* ============ CONFIG – fill once ============= */
const ROUTER_ADDRESS = "0x3E80DA6ea25a799e9e377b0c2AF758a98e94Ab13";   // <-- change
const ROUTER_ABI = [
  "function mintWithSecret(string secretWord) external"
];

/* ============ Globals ============= */
let provider, signer, router, connected = false;

/* ============ DOM refs ============= */
const secretInput = document.getElementById("secretInput");
const claimBtn    = document.getElementById("claimButton");
const statusTxt   = document.getElementById("statusText");
const statusDot   = document.getElementById("statusDot");
const msgEl       = document.getElementById("message");

/* ============ Helpers ============= */
const short = a => a.slice(0,6) + "…" + a.slice(-4);
const setStatus = (t,c)=>{ statusTxt.textContent=t; statusDot.className="status-dot "+c; };
const setMsg = (t,c="") => { msgEl.textContent=t; msgEl.className="message "+c; msgEl.style.display=t?"block":"none"; };

/* ============ Init ============= */
document.addEventListener("DOMContentLoaded",()=>{ claimBtn.onclick = connect; });

/* ============ Connect ============= */
async function connect(){
  if(!window.ethereum){ setMsg("Install MetaMask","error"); return; }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  signer  = provider.getSigner();
  router  = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

  const me = await signer.getAddress();
  connected = true;
  setStatus("Connected: "+short(me),"connected");
  claimBtn.textContent = "Mint POAP";
  claimBtn.onclick     = mint;
}

/* ============ Mint ============= */
async function mint(){
  const word = secretInput.value.trim();
  if(!word){ setMsg("Enter the secret word","error"); return; }

  try{
    setMsg("Submitting…","pending");
    claimBtn.disabled = true;
    const tx = await router.mintWithSecret(word);
    await tx.wait();
    setMsg("🎉 NFT minted! Check BlockScout.","success");
  }catch(err){
    console.error(err);
    if(err.message.includes("Already")) setMsg("You already minted with this code","error");
    else if(err.message.includes("invalid")) setMsg("Wrong secret word","error");
    else setMsg("Mint failed – see console","error");
  }finally{ claimBtn.disabled=false; }
}
