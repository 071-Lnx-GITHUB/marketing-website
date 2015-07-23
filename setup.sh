#!/bin/bash

ln -s -f ../../hooks/post-checkout.sh .git/hooks/post-checkout
ln -sf ../../hooks/post-merge.sh .git/hooks/post-merge
