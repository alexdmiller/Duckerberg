require 'rspec'
require    '../game_manager/game_manager.rb'

describe GameManager do

  describe "#initialize" do
    it "should setup logging and redis correctly" do
      @log = mock('logfile')
      @redis = mock('redis')
      File.should_receive(:new).once.with("/home/ubuntu/duckerberglog/game_daemon_log.txt", 'a').and_return(@log)
      Redis.should_receive(:new).once.and_return(@redis)

      @redis.should_receive(:flushdb).and_return(true)
      @log.should_receive(:syswrite).twice.and_return(true)
      @game_manager = GameManager.new
    end

    it "should prepare empty hashes for users and sockets" do
      @log = mock('logfile')
      @redis = mock('redis')
      File.stub!(:new).and_return(@log)
      Redis.stub!(:new).and_return(@redis)

      @redis.stub!(:flushdb).and_return(true)
      @log.stub!(:syswrite).twice.and_return(true)

      Time.should_receive(:now).exactly(4).times.and_return(1)
      @game_manager = GameManager.new

      @game_manager.users_by_id.should     == {}
      @game_manager.ids_by_socket.should   == {}
      @game_manager.sockets_by_id.should   == {}
      @game_manager.game_start_time.should == 1
    end
  end

end
