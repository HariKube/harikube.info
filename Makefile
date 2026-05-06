HUGO_ENV?=staging

shell:
	@docker rm -f harikube-hugo-shell
	@docker run --name harikube-hugo-shell --rm -it \
		-w /src \
  		-v $(PWD):/src \
  		-v $(HOME)/hugo_cache:/tmp/hugo_cache \
		-p 38080:38080 \
  		hugomods/hugo:debian-node-git-0.151.1 \
  		/bin/sh

run:
	@docker rm -f harikube-hugo-run
	@docker run --name harikube-hugo-run --rm \
		-w /src \
  		-v $(PWD):/src \
  		-v $(HOME)/hugo_cache:/tmp/hugo_cache \
		-p 38080:38080 \
  		hugomods/hugo:debian-node-git-0.151.1 \
  		sh -c "npm install && npm run start"

gen:
	@rm -rf public/*
	@docker run --rm \
		-w /src \
  		-v $(PWD):/src \
		-e HUGO_ENV=$(HUGO_ENV) \
  		hugomods/hugo:debian-node-git-0.151.1 \
  		npm run build

validate: gen
	@docker run --rm \
		-v $(PWD)/public:/public \
		-v $(PWD)/public/license/index.html:/public/pages/terms-conditions-mail.html \
		wjdp/htmltest /public --skip-external
	
	@docker run --rm \
		-v $(PWD)/public:/public \
		--entrypoint=kubeconform \
		stagex/kubeconform:0.6.4 -summary -ignore-missing-schemas -insecure-skip-tls-verify /public/manifests

	@for img in $$(find public \( -name *.html -o -name *.yaml \) -exec grep -oE "(registry.harikube.info|quay.io)/harikube/([a-zA-Z0-9\:\.\-]+)" {} \; | grep -v "harikube-helm-charts" | sort -n | uniq) ; do \
		docker pull "$$img" && docker rmi "$$img" || exit 1 ; \
	done

