const colors = ['blue','green','red'];      //css te 3 ayrı class oldugu icin indexte yazdırırken class tanımlayarak bu renk isimlerine ulasmam yeterli.

const randomColor=()=>{
    return colors[Math.floor(Math.random()*colors.length)];
};

module.exports = randomColor;