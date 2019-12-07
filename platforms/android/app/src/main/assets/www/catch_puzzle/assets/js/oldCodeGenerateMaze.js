
    var r = genRandom(0,1);
    var amount = (w*h) / m.length;
    amount = (amount / 2) - 1; 
    var lineRandom = m.length / 2;
    var lineRandom = genRandom(lineRandom*0.8, lineRandom*1.2);
    var cellFree = genRandom(1, (m.length - 2));
    if(r == 0)
    {
        m = createWallH(lineRandom, 0, (m.length-1), cellFree, m);
        r++;
    }
    else
    {
        m = createWallV(lineRandom, 0, (m.length-1), cellFree, m);
        r--;
    }

    var lastWallH = lineRandom;
    var lastWallV = lineRandom;
    var _lineRandom;
    var posI;
    var posF;
    var colsUsed = [];
    var rowsUsed = [];
    for(var i = 0; i < amount; i++)
    {
        for(var j = 0; j < 2; j++)
        {
            if(r == 0)
            {//Horizontal
                r++;
                if(i==0)
                {
                    if(j==0)
                    {//First
                        
                    }
                    else
                    {

                    }

                }
                else
                {
                    if(j==0)
                    {//First
                        
                    }
                    else
                    {

                    } 
                }
                m = createWallH(_lineRandom, posI, posF, free, m);
            }
            else 
            {//Vertical
                if(i==0)
                {
                    if(j==0)
                    {
                        //First & first
                        _lineRandom = genRandom(2, m.length-3);
                        free = genRandom(2, m.length-3);
                        posF = lineRandom-2;
                        posI = 1;
                    }
                    else
                    {

                    }
                    
                }
                else
                {
                    if(j==0)
                    {

                    }
                    else
                    {

                    }

                }
                m = createWallV(_lineRandom, posI, posF, free, m);

                r--;
            }
        }
    }

    function createWallH(posX, posI, posF, free, m)
{
    for(var i = posI; i <= posF; i++)
    {
        if(i != free)
        {
            m[posX][i] = "X";
        }
    }
    return m;
}

function createWallV(posY, posI, posF, free, m)
{
    for(var i = posI; i <= posF; i++)
    {
        if(i!=free)
        {
            m[i][posY] = "X";
        }
    }
    return m;
}
