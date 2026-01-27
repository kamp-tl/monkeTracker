export function logReq(req, res, next) {
    console.log(`${req.method} - ${req.url}`);
  
    if (req.body) {
      console.log(`Req Data:`, req.body);
    }
  
    next();
  }
  
export function checkJson(req, res, next) {
    if (req.method === 'POST' && !req.is('json')) {
        return res.status(400).send('Expected JSON data');
    }
    
    next();
}

export function globalErr(err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500).json({ error: err.message});
  }
 