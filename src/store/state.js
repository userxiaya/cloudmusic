const state = {
  musicList: [
  ], // 播放列表
  historyList: [],
  searchHistory: [],
  currentIndex: '', // song.id
  playing: false,
  playerObj: {
    duration: 0,
    position: 0
  },
  playerShowFlag: false,
  prevTempList: [], // 上一曲缓存（用于优化随机播放上一曲和下一曲切换逻辑 存20手只存id）(暂时不用)
  playMode: 1, // 1列表循环2随机播放3单曲循环
  loginState: false,
  checkLogin: false,
  userName: '',
  userId: '',
  userImg: ''
}

export default state
