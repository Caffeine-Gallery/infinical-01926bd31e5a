export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getHolidays' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Text))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
