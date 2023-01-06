---
title: Rails sidekiq をローカルで立ち上げる
date: '2023-01-06 00:00:00'
description: Rails, Ruby, sidekiq
category: Rails
background: '#4169e1'
---

# 概要

SideKiq をローカル環境で立ち上げる。

## 準備

```ruby
...
gem 'sidekiq', '4.2.10'
...
```

bundle install を実行する

```shell
$ bundle install
```

## ソースコード

app/workers/hard_worker.rb

```ruby
class HardWorker
  include Sidekiq::Worker
  sidekiq_options queue: :test, retry: 5

  def perform(title)
    p 'work: title=' + title
    sleep 60
  end
end
```

config/route.rb

```ruby
require 'sidekiq/web'

Rails.application.routes.draw do
  get 'password_resets/new'
  ...
  if Rails.env.development?
    mount Sidekiq::Web, at: '/sidekiq'
  end
end
```

config/sidekiq.yml

```ruby
:concurrency: 25
:queues:
  - default
  - mailers
  - test
```

config/initializers/sidekiq.rb

```ruby
Sidekiq.configure_server do |config|
  config.redis = { url: 'redis://localhost:6379' }
end

Sidekiq.configure_client do |config|
  config.redis = { url: 'redis://localhost:6379' }
end
```

```shell
# ターミナル1
$ brew services start redis
# ターミナル2
$ rails s
# ターミナル3
$ bundle exec sidekiq -C config/sidekiq.yml
# ブラウザで http://localhost:3000/sidekiq
```

```
# ワーカーにタスクを追加する
$ rails c
Running via Spring preloader in process 98325
Loading development environment (Rails 5.1.6)
>> HardWorker.perform_async('pizza')
=> "cf2e23787603404e7e305119"
```

sleep 中のためタスクが実行中
![pic1](/assets/img/rails-sidekiq-sample/sidekiq1.png)
sleep 後のためタスクが実行完了
![pic2](/assets/img/rails-sidekiq-sample/sidekiq2.png)

# 参考

-   https://github.com/mperham/sidekiq/wiki/Getting-Started#rails
-   https://qiita.com/sazumy/items/dabd550e3f969f72d64c
