import Auth from '@/components/Auth';

export default function Inventory() {
  const { currencies, isLoggedIn } = Auth.useUser();
  return isLoggedIn ? (
    <>
      <label htmlFor="inventory">Currencies</label>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <input
          id="T1"
          style={{ width: '45%' }}
          type="text"
          value={`Brawl Bucks: ${currencies?.T1 || 0}`}
          disabled
        />
        <input
          id="T2"
          style={{ width: '45%' }}
          type="text"
          value={`Nifty Nuggets: ${currencies?.T2 || 0}`}
          disabled
        />
      </div>
      <label htmlFor="characters">Characters</label>
      <div>coming soon...</div>
    </>
  ) : null;
}
