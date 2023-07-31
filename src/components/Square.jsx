import '../css/Square.css';

export function Square ({ value, onSelect }) {
  const handleClick = () => {
    onSelect(value);
  };

  return (
    <div className='square user-option' onClick={handleClick}>
      {value}
    </div>
  );
}
