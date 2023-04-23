
const getStatus = (_, res) => {
  res.send({
    api: 'ok'
  });
};

export default {
  getStatus
};
